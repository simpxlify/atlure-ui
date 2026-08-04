import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { access, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

const defaultChromePaths = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
];

async function findChrome() {
  const fromEnvironment = process.env.CHROME_PATH;
  if (fromEnvironment) return fromEnvironment;

  for (const candidate of defaultChromePaths) {
    try {
      await access(candidate);
      return candidate;
    } catch {
      continue;
    }
  }
  throw new Error('no Chrome found, set CHROME_PATH');
}

function serveStaticBuild(staticRoot, port) {
  const server = createServer(async (request, response) => {
    const requestedPath = decodeURIComponent(request.url.split('?')[0]);
    const filePath = join(staticRoot, normalize(requestedPath === '/' ? '/index.html' : requestedPath));
    try {
      const body = await readFile(filePath);
      response.writeHead(200, {
        'content-type': mimeTypes[extname(filePath)] ?? 'application/octet-stream',
      });
      response.end(body);
    } catch {
      response.writeHead(404).end('not found');
    }
  });

  return new Promise((resolveServer) => {
    server.listen(port, () => resolveServer(server));
  });
}

async function waitForPageTarget(debugPort) {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    await new Promise((done) => setTimeout(done, 250));
    try {
      const response = await fetch(`http://127.0.0.1:${debugPort}/json/list`);
      const targets = await response.json();
      const page = targets.find((target) => target.type === 'page');
      if (page) return page;
    } catch {
      continue;
    }
  }
  throw new Error('chrome never exposed a page target');
}

async function connect(webSocketDebuggerUrl) {
  const socket = new WebSocket(webSocketDebuggerUrl);
  const pending = new Map();
  let nextId = 0;

  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    const settle = pending.get(message.id);
    if (!settle) return;
    pending.delete(message.id);
    settle(message);
  });

  await new Promise((resolveReady, rejectReady) => {
    socket.addEventListener('open', resolveReady, { once: true });
    socket.addEventListener('error', rejectReady, { once: true });
  });

  function send(method, params = {}) {
    const id = (nextId += 1);
    return new Promise((settle) => {
      pending.set(id, settle);
      socket.send(JSON.stringify({ id, method, params }));
    });
  }

  return { socket, send };
}

export async function withStorybookPage(callback, { staticRoot, port = 6199, debugPort = 9333 } = {}) {
  const root = resolve(staticRoot ?? fileURLToPath(new URL('../storybook-static', import.meta.url)));
  const chromePath = await findChrome();
  const server = await serveStaticBuild(root, port);

  const chrome = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${debugPort}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    `--user-data-dir=${join(tmpdir(), 'atlure-storybook-cdp-profile')}`,
    'about:blank',
  ]);

  try {
    const { webSocketDebuggerUrl } = await waitForPageTarget(debugPort);
    const { socket, send } = await connect(webSocketDebuggerUrl);
    await send('Page.enable');
    await send('Runtime.enable');

    async function evaluate(expression) {
      const { result } = await send('Runtime.evaluate', {
        expression,
        awaitPromise: true,
        returnByValue: true,
      });
      if (result?.exceptionDetails) {
        const { exception, text } = result.exceptionDetails;
        throw new Error(exception?.description ?? text ?? 'evaluation failed');
      }
      return result?.result?.value ?? null;
    }

    async function openStory(storyId, globals = '') {
      const globalsQuery = globals ? `&globals=${globals}` : '';
      await send('Page.navigate', {
        url: `http://127.0.0.1:${port}/iframe.html?id=${storyId}&viewMode=story${globalsQuery}`,
      });

      for (let attempt = 0; attempt < 80; attempt += 1) {
        await new Promise((done) => setTimeout(done, 250));
        const isRendered = await evaluate(
          `Boolean(document.querySelector('#storybook-root > *')) && document.readyState === 'complete'`,
        );
        if (isRendered) return;
      }
      throw new Error(`story ${storyId} never rendered`);
    }

    const outcome = await callback({ evaluate, openStory, staticRoot: root });
    socket.close();
    return outcome;
  } finally {
    chrome.kill();
    server.close();
  }
}
