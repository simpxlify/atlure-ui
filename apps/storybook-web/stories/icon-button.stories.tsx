import { IconButton, Stack } from '@atlure/ui-web';
import type { Meta, StoryObj } from '@storybook/react-vite';

const HeartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-4 w-4">
    <path
      d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.5-7 10-7 10z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);

const meta = {
  title: 'Web/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  args: {
    'aria-label': 'Add Luna to favourites',
    icon: <HeartIcon />,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'destructive'],
    },
  },
} satisfies Meta<typeof IconButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Variants: Story = {
  render: (args) => (
    <Stack direction="row" gap="sm" align="center">
      <IconButton {...args} variant="primary" />
      <IconButton {...args} variant="secondary" />
      <IconButton {...args} variant="outline" />
      <IconButton {...args} variant="ghost" />
      <IconButton {...args} variant="destructive" />
    </Stack>
  ),
};

export const Loading: Story = {
  args: {
    isLoading: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
