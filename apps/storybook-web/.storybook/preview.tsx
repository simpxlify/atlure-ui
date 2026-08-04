import type { Decorator, Preview } from '@storybook/react-vite';
import { useEffect } from 'react';
import './tailwind.css';

const withAtlureTheme: Decorator = (Story, context) => {
  const isDark = context.globals.theme === 'dark';

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  return (
    <div className="flex min-h-screen flex-col gap-lg bg-background p-lg text-foreground">
      <Story />
    </div>
  );
};

const preview: Preview = {
  decorators: [withAtlureTheme],
  initialGlobals: {
    theme: 'light',
  },
  globalTypes: {
    theme: {
      description: 'Atlure color theme',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true },
    a11y: { test: 'error' },
  },
};

export default preview;
