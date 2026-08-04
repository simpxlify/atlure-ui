import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Stack,
} from '@atlure/ui-web';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Web/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['elevated', 'outlined', 'flat'] },
    padding: { control: 'select', options: ['none', 'sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Card {...args} className="max-w-sm">
      <CardHeader>
        <CardTitle>Overnight stays</CardTitle>
        <CardDescription>Your dog sleeps at a vetted sitter's home</CardDescription>
      </CardHeader>
      <CardContent>
        <Badge variant="secondary">From 25 EUR / night</Badge>
      </CardContent>
      <CardFooter>
        <Button size="sm">Find sitters</Button>
        <Button size="sm" variant="ghost">
          Learn more
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const Variants: Story = {
  render: () => (
    <Stack direction="row" gap="md" shouldWrap align="start">
      <Card variant="elevated" className="max-w-xs">
        <CardHeader>
          <CardTitle>Elevated</CardTitle>
          <CardDescription>Default surface for marketing sections</CardDescription>
        </CardHeader>
      </Card>
      <Card variant="outlined" className="max-w-xs">
        <CardHeader>
          <CardTitle>Outlined</CardTitle>
          <CardDescription>Full-strength border, no shadow</CardDescription>
        </CardHeader>
      </Card>
      <Card variant="flat" className="max-w-xs">
        <CardHeader>
          <CardTitle>Flat</CardTitle>
          <CardDescription>No border, for nesting inside another surface</CardDescription>
        </CardHeader>
      </Card>
    </Stack>
  ),
};

export const Interactive: Story = {
  render: () => (
    <Card isInteractive className="max-w-sm">
      <CardHeader>
        <CardTitle asChild>
          <h2>
            <a href="#dog-walking" className="underline-offset-4 hover:underline">
              Dog walking
            </a>
          </h2>
        </CardTitle>
        <CardDescription>A 60-minute walk, tracked end to end</CardDescription>
      </CardHeader>
    </Card>
  ),
};

export const Loading: Story = {
  render: () => (
    <Card className="max-w-sm" aria-busy="true">
      <CardHeader>
        <div className="h-4 w-2/3 animate-pulse rounded-sm bg-muted" />
        <div className="h-3 w-full animate-pulse rounded-sm bg-muted" />
      </CardHeader>
      <CardContent>
        <div className="h-3 w-1/2 animate-pulse rounded-sm bg-muted" />
      </CardContent>
    </Card>
  ),
};

export const Empty: Story = {
  render: () => (
    <Card className="max-w-sm items-center text-center">
      <CardHeader className="items-center">
        <CardTitle>No sitters yet</CardTitle>
        <CardDescription>Widen your search radius to see more sitters</CardDescription>
      </CardHeader>
      <CardFooter className="justify-center">
        <Button variant="outline" size="sm">
          Widen search
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const ErrorState: Story = {
  render: () => (
    <Card variant="outlined" className="max-w-sm border-destructive">
      <CardHeader>
        <CardTitle>We could not load sitters</CardTitle>
        <CardDescription>Check your connection and try again</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button variant="destructive" size="sm">
          Retry
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const LongContent: Story = {
  render: () => (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>
          Overnight stays, dog walking, drop-in visits and day care with fully insured sitters
        </CardTitle>
        <CardDescription>
          Every sitter is identity-checked, reviewed by other owners and covered by Atlure
          insurance for the whole stay, in every country we operate in.
        </CardDescription>
      </CardHeader>
    </Card>
  ),
};
