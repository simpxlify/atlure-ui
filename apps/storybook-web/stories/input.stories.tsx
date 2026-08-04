import { Input, Stack } from '@atlure/ui-web';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Web/Input',
  component: Input,
  tags: ['autodocs'],
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
  },
  argTypes: {
    controlSize: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHint: Story = {
  args: {
    hint: 'We only use this to confirm your booking',
  },
};

export const Invalid: Story = {
  args: {
    defaultValue: 'not-an-email',
    errorMessage: 'Enter a valid email address',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: 'owner@atlure.eu',
  },
};

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    defaultValue: 'owner@atlure.eu',
  },
};

export const Sizes: Story = {
  render: (args) => (
    <Stack gap="md">
      <Input {...args} controlSize="sm" label="Small" />
      <Input {...args} controlSize="md" label="Medium" />
      <Input {...args} controlSize="lg" label="Large" />
    </Stack>
  ),
};

export const WithoutVisibleLabel: Story = {
  args: {
    label: undefined,
    'aria-label': 'Search sitters by city',
    placeholder: 'Search sitters by city',
  },
};
