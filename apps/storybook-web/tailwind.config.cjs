const atlurePreset = require('@atlure/tailwind-preset');

module.exports = {
  presets: [atlurePreset],
  darkMode: 'class',
  content: [
    './stories/**/*.{ts,tsx}',
    './.storybook/**/*.{ts,tsx}',
    '../../packages/ui-web/src/**/*.{ts,tsx}',
  ],
};
