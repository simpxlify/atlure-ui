import { Badge, Stack } from '@atlure/ui-web';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Web/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: {
    children: 'Verified sitter',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'muted', 'outline', 'destructive'],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Variants: Story = {
  render: (args) => (
    <Stack direction="row" gap="sm" shouldWrap align="center">
      <Badge {...args} variant="primary" />
      <Badge {...args} variant="secondary" />
      <Badge {...args} variant="muted" />
      <Badge {...args} variant="outline" />
      <Badge {...args} variant="destructive">
        Booking cancelled
      </Badge>
    </Stack>
  ),
};

export const LongLabel: Story = {
  args: {
    children: 'Insured, identity-checked and reviewed by 40 owners',
  },
};
