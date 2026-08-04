import { Badge, Card, CardHeader, CardTitle, Container, Stack } from '@atlure/ui-web';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Web/Layout',
  component: Stack,
  tags: ['autodocs'],
  argTypes: {
    direction: { control: 'select', options: ['row', 'column'] },
    gap: { control: 'select', options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'] },
    align: { control: 'select', options: ['start', 'center', 'end', 'stretch'] },
    justify: { control: 'select', options: ['start', 'center', 'end', 'between'] },
  },
} satisfies Meta<typeof Stack>;

export default meta;

type Story = StoryObj<typeof meta>;

export const StackColumn: Story = {
  args: {
    direction: 'column',
    gap: 'md',
  },
  render: (args) => (
    <Stack {...args}>
      <Card padding="sm">
        <CardHeader>
          <CardTitle>Overnight stays</CardTitle>
        </CardHeader>
      </Card>
      <Card padding="sm">
        <CardHeader>
          <CardTitle>Dog walking</CardTitle>
        </CardHeader>
      </Card>
    </Stack>
  ),
};

export const StackRowWrapping: Story = {
  args: {
    direction: 'row',
    gap: 'sm',
    shouldWrap: true,
    align: 'center',
  },
  render: (args) => (
    <Stack {...args}>
      {['Overnight', 'Walking', 'Day care', 'Drop-in visits', 'Grooming', 'Training'].map(
        (service) => (
          <Badge key={service} variant="outline">
            {service}
          </Badge>
        ),
      )}
    </Stack>
  ),
};

export const ContainerWidths: Story = {
  render: () => (
    <Stack gap="md">
      {(['sm', 'md', 'lg', 'xl'] as const).map((width) => (
        <Container key={width} width={width} className="border border-dashed border-border py-md">
          <p className="text-sm text-muted-foreground">max-width: {width}</p>
        </Container>
      ))}
    </Stack>
  ),
};

export const ContainerAsSemanticSection: Story = {
  render: () => (
    <Container asChild width="md">
      <section aria-labelledby="services-heading" className="py-lg">
        <h2 id="services-heading" className="text-2xl font-semibold">
          Services
        </h2>
        <p className="text-muted-foreground">
          Container renders as any element through asChild, so marketing pages keep their semantics.
        </p>
      </section>
    </Container>
  ),
};
