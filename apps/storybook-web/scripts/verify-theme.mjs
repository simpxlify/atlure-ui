import { withStorybookPage } from './chrome-harness.mjs';

const atlurePrimary = 'rgb(234, 88, 12)';
const probeStoryId = 'web-button--primary';
const nativeProbeStoryId = 'native-button--primary';

const readSurface = `JSON.stringify({
  documentClass: document.documentElement.className,
  surfaceBackground: getComputedStyle(document.querySelector('#storybook-root > div')).backgroundColor,
  surfaceForeground: getComputedStyle(document.querySelector('#storybook-root > div')).color,
  buttonBackground: getComputedStyle(document.querySelector('#storybook-root button')).backgroundColor,
})`;

const readNativeSurface = `JSON.stringify({
  buttonBackground: getComputedStyle(document.querySelector('#storybook-root [role="button"]')).backgroundColor,
})`;

const { light, dark, native } = await withStorybookPage(async ({ openStory, evaluate }) => {
  await openStory(probeStoryId, 'theme:light');
  const lightSurface = JSON.parse(await evaluate(readSurface));

  await openStory(probeStoryId, 'theme:dark');
  const darkSurface = JSON.parse(await evaluate(readSurface));

  await openStory(nativeProbeStoryId, 'theme:light');
  const nativeSurface = JSON.parse(await evaluate(readNativeSurface));

  return { light: lightSurface, dark: darkSurface, native: nativeSurface };
});

console.log('light: ', JSON.stringify(light));
console.log('dark:  ', JSON.stringify(dark));
console.log('native:', JSON.stringify(native));

const failures = [];

if (light.surfaceBackground === dark.surfaceBackground) {
  failures.push('the surface background is identical in both themes');
}
if (light.surfaceForeground === dark.surfaceForeground) {
  failures.push('the surface foreground is identical in both themes');
}
if (dark.documentClass !== 'dark') {
  failures.push(`expected the dark class on <html>, saw "${dark.documentClass}"`);
}
if (light.documentClass.includes('dark')) {
  failures.push('the dark class survived into the light theme');
}
if (light.buttonBackground !== atlurePrimary) {
  failures.push(`the primary button is not the Atlure primary token: ${light.buttonBackground}`);
}
if (light.buttonBackground !== dark.buttonBackground) {
  failures.push('primary is theme-independent by design, but it changed');
}
if (native.buttonBackground !== atlurePrimary) {
  failures.push(`the native primary button is not the Atlure primary token: ${native.buttonBackground}`);
}

if (failures.length > 0) {
  console.error('FAIL');
  for (const failure of failures) console.error(' -', failure);
  process.exit(1);
}

console.log('PASS: light and dark render differently, both driven by the Atlure tokens');
