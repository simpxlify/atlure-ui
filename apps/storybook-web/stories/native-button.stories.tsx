import { Button } from '@atlure/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Native/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    label: 'Book a sitter',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'destructive'],
    },
    size: { control: 'select', options: ['sm', 'md', 'lg', 'icon'] },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
