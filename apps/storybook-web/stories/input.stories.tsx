import { FormField, Input, Stack } from '@atlure/ui-web';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Web/Input',
  component: Input,
  tags: ['autodocs'],
  args: {
    placeholder: 'you@example.com',
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <FormField label="Email">
      <Input {...args} />
    </FormField>
  ),
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHint: Story = {
  render: (args) => (
    <FormField label="Email" helperText="We only use this to confirm your booking">
      <Input {...args} />
    </FormField>
  ),
};

export const Invalid: Story = {
  args: {
    defaultValue: 'not-an-email',
  },
  render: (args) => (
    <FormField label="Email" error="Enter a valid email address">
      <Input {...args} />
    </FormField>
  ),
};

export const Disabled: Story = {
  args: {
    isDisabled: true,
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
      <FormField label="Small">
        <Input {...args} size="sm" />
      </FormField>
      <FormField label="Medium">
        <Input {...args} size="md" />
      </FormField>
      <FormField label="Large">
        <Input {...args} size="lg" />
      </FormField>
    </Stack>
  ),
};

export const WithoutVisibleLabel: Story = {
  args: {
    'aria-label': 'Search sitters by city',
    placeholder: 'Search sitters by city',
  },
  render: (args) => <Input {...args} />,
};
