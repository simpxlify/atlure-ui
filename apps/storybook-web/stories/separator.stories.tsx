import { Separator, Stack } from '@atlure/ui-web';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Web/Separator',
  component: Separator,
  tags: ['autodocs'],
} satisfies Meta<typeof Separator>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: () => (
    <div className="max-w-md">
      <p>Verified sitters near you</p>
      <Separator />
      <p>Insured every booking</p>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <Stack direction="row" gap="md" align="center">
      <span>Insured</span>
      <Separator orientation="vertical" className="h-6" />
      <span>Vetted</span>
      <Separator orientation="vertical" className="h-6" />
      <span>Reviewed</span>
    </Stack>
  ),
};
