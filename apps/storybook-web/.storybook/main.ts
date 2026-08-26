import type { StorybookConfig } from '@storybook/react-native-web-vite';

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/react-native-web-vite',
    options: {},
  },
  core: {
    disableTelemetry: true,
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
  async viteFinal(config) {
    config.esbuild = {
      ...(config.esbuild ?? {}),
      jsx: 'automatic',
      jsxImportSource: 'nativewind',
    };
    return config;
  },
};

export default config;
