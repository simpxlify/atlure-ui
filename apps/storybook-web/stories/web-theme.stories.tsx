import {
  EmptyState,
  ErrorState,
  Skeleton,
  Spinner,
  Stack,
  ThemeProvider,
  ThemeToggle,
  useTheme,
} from '@atlure/ui-web';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Web/Theme',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div className="rounded-lg border border-border bg-background p-lg text-foreground">
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

function ThemeReadout() {
  const { theme, resolvedTheme } = useTheme();
  return (
    <p className="text-sm text-muted-foreground">
      preference: <b>{theme}</b> · resolved: <b>{resolvedTheme}</b>
    </p>
  );
}

export const ToggleAndReadout: Story = {
  render: () => (
    <Stack gap="md">
      <ThemeReadout />
      <ThemeToggle />
    </Stack>
  ),
};

export const Skeletons: Story = {
  render: () => (
    <Stack gap="sm">
      <Skeleton shape="title" />
      <Skeleton shape="line" />
      <Skeleton shape="line" className="w-4/5" />
      <Skeleton shape="block" />
    </Stack>
  ),
};

export const SpinnerLoading: Story = {
  render: () => (
    <Stack gap="md" align="center">
      <Spinner className="h-8 w-8 text-primary" />
      <p className="text-sm text-muted-foreground">Fetching sitters near you…</p>
    </Stack>
  ),
};

export const EmptyStateExample: Story = {
  render: () => (
    <EmptyState
      title="No sitters yet"
      description="Try widening the search radius or the date range."
      action={
        <button
          type="button"
          className="rounded-md bg-primary px-md py-sm text-primary-foreground"
        >
          Adjust filters
        </button>
      }
    />
  ),
};

export const ErrorStateExample: Story = {
  render: () => (
    <ErrorState
      title="Something went wrong"
      description="We could not load sitters. Please try again in a moment."
      action={
        <button
          type="button"
          className="rounded-md border border-border bg-background px-md py-sm text-foreground"
        >
          Try again
        </button>
      }
    />
  ),
};
