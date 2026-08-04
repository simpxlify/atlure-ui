import { readFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';

const BLOCK_SIZE = 512;
const REGULAR_FILE_FLAGS = new Set(['0', '\0']);

function readNullTerminated(buffer, start, length) {
  return buffer.toString('utf8', start, start + length).replace(/\0.*$/, '');
}

export function listTarballContents(tarballPath) {
  const buffer = gunzipSync(readFileSync(tarballPath));
  const paths = [];

  for (let offset = 0; offset + BLOCK_SIZE <= buffer.length; ) {
    const name = readNullTerminated(buffer, offset, 100);
    if (!name) break;

    const typeFlag = String.fromCharCode(buffer[offset + 156]);
    const octalSize = readNullTerminated(buffer, offset + 124, 12).trim();
    const size = parseInt(octalSize, 8) || 0;

    if (REGULAR_FILE_FLAGS.has(typeFlag)) {
      const prefix = readNullTerminated(buffer, offset + 345, 155);
      paths.push((prefix ? `${prefix}/${name}` : name).replace(/^package\//, ''));
    }

    offset += BLOCK_SIZE + Math.ceil(size / BLOCK_SIZE) * BLOCK_SIZE;
  }

  return paths.sort();
}
