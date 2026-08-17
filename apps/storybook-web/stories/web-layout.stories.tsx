import {
  Container,
  Grid,
  Prose,
  Row,
  Section,
  Stack,
  VisuallyHidden,
} from '@atlure/ui-web';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Web/Layout/Primitives',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const cell = 'rounded-md border border-dashed border-border p-md text-sm';

export const SectionAndContainer: Story = {
  render: () => (
    <Section tone="muted">
      <Container size="default">
        <Stack gap="md">
          <h2 className="text-xl font-semibold">Section + Container</h2>
          <p>Vertical rhythm from Section, horizontal from Container.</p>
        </Stack>
      </Container>
    </Section>
  ),
};

export const SectionAs: Story = {
  render: () => (
    <Stack gap="sm">
      <Section as="header" tone="primary">
        <Container>as=&quot;header&quot;</Container>
      </Section>
      <Section as="footer" tone="muted">
        <Container>as=&quot;footer&quot;</Container>
      </Section>
    </Stack>
  ),
};

export const ResponsiveGrid: Story = {
  render: () => (
    <Container>
      <Grid cols={{ base: 1, md: 3 }}>
        <div className={cell}>City sitter one</div>
        <div className={cell}>City sitter two</div>
        <div className={cell}>City sitter three</div>
      </Grid>
    </Container>
  ),
};

export const StackAndRow: Story = {
  render: () => (
    <Stack gap="lg">
      <Stack gap="sm">
        <div className={cell}>A</div>
        <div className={cell}>B</div>
      </Stack>
      <Row gap="sm">
        <div className={cell}>A</div>
        <div className={cell}>B</div>
      </Row>
    </Stack>
  ),
};

export const ProseArticle: Story = {
  render: () => (
    <Container size="prose">
      <Prose as="article">
        <h2>Terms of service</h2>
        <p>
          Atlure connects pet owners with vetted sitters. By using the service you agree to the
          terms below.
        </p>
        <h3>Bookings</h3>
        <ul>
          <li>Free cancellation up to 24 hours before.</li>
          <li>Cards are charged only after the sitter confirms.</li>
        </ul>
      </Prose>
    </Container>
  ),
};

export const SkipLink: Story = {
  render: () => (
    <a href="#main">
      <VisuallyHidden>Skip to main content</VisuallyHidden>
    </a>
  ),
};
