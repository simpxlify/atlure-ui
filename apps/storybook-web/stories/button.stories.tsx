import { Button, Stack } from '@atlure/ui-web';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Web/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    children: 'Book a sitter',
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

export const Variants: Story = {
  render: (args) => (
    <Stack direction="row" gap="sm" shouldWrap align="center">
      <Button {...args} variant="primary" />
      <Button {...args} variant="secondary" />
      <Button {...args} variant="outline" />
      <Button {...args} variant="ghost" />
      <Button {...args} variant="destructive" />
    </Stack>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <Stack direction="row" gap="sm" align="center">
      <Button {...args} size="sm" />
      <Button {...args} size="md" />
      <Button {...args} size="lg" />
    </Stack>
  ),
};

export const Loading: Story = {
  args: {
    isLoading: true,
    loadingLabel: 'Sending your request',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const FullWidth: Story = {
  args: {
    isFullWidth: true,
  },
};

export const AsLink: Story = {
  args: {
    asChild: true,
    children: undefined,
  },
  render: (args) => (
    <Button {...args} asChild>
      <a href="#sitters">Find sitters near you</a>
    </Button>
  ),
};

export const IconOnly: Story = {
  args: {
    size: 'icon',
    'aria-label': 'Add a pet',
    children: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-4 w-4">
        <path
          d="M12 5v14M5 12h14"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
};
