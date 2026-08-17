import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Container } from './container';
import { Grid, colsToClassNames } from './grid';
import { Prose } from './prose';
import { Section } from './section';
import { Row, Stack } from './stack';
import { VisuallyHidden } from './visually-hidden';

describe('When rendering a Section', () => {
  it('renders a <section> by default', () => {
    render(<Section data-testid="landing">Hero content</Section>);
    expect(screen.getByTestId('landing').tagName).toBe('SECTION');
  });

  it('renders the requested sectioning element via `as`', () => {
    render(
      <Section as="footer" data-testid="footer">
        Site footer
      </Section>,
    );
    expect(screen.getByTestId('footer').tagName).toBe('FOOTER');
  });

  it('applies tone tokens to the background', () => {
    render(
      <Section tone="muted" data-testid="cta">
        CTA
      </Section>,
    );
    expect(screen.getByTestId('cta')).toHaveClass('bg-muted');
  });
});

describe('When rendering a Grid', () => {
  it('translates a responsive cols spec into Tailwind breakpoint classes', () => {
    const classes = colsToClassNames({ base: 1, md: 3 });
    expect(classes).toContain('grid-cols-1');
    expect(classes).toContain('md:grid-cols-3');
  });

  it('renders the class list into the DOM', () => {
    render(
      <Grid cols={{ base: 1, md: 3 }} data-testid="feature-grid">
        <div />
      </Grid>,
    );
    const grid = screen.getByTestId('feature-grid');
    expect(grid).toHaveClass('grid');
    expect(grid).toHaveClass('grid-cols-1');
    expect(grid).toHaveClass('md:grid-cols-3');
  });

  it('accepts a scalar cols value', () => {
    render(
      <Grid cols={2} data-testid="grid">
        <div />
      </Grid>,
    );
    expect(screen.getByTestId('grid')).toHaveClass('grid-cols-2');
  });
});

describe('When rendering a Stack', () => {
  it('uses gap-* classes rather than space-x/space-y', () => {
    render(
      <Stack gap="md" data-testid="stack">
        <div />
        <div />
      </Stack>,
    );
    const stack = screen.getByTestId('stack');
    expect(stack.className).toMatch(/(^|\s)gap-/);
    expect(stack.className).not.toMatch(/space-[xy]-/);
  });

  it('Row is a horizontal Stack shortcut', () => {
    render(
      <Row data-testid="row">
        <div />
      </Row>,
    );
    expect(screen.getByTestId('row')).toHaveClass('flex-row');
  });
});

describe('When rendering a Container', () => {
  it('accepts the ticket-mandated `size` variant', () => {
    render(
      <Container size="prose" data-testid="c">
        content
      </Container>,
    );
    expect(screen.getByTestId('c')).toHaveClass('max-w-prose');
  });
});

describe('When rendering a VisuallyHidden', () => {
  it('keeps the child text in the DOM but hides it from sighted users via clip-path', () => {
    const { container } = render(<VisuallyHidden>Skip to main content</VisuallyHidden>);
    expect(container.textContent).toContain('Skip to main content');
    const span = container.querySelector('span');
    if (!span) throw new Error('missing span');
    expect(span.className).toMatch(/clip-path/);
    expect(span.className).not.toMatch(/(^|\s)hidden(\s|$)/);
    expect(span.className).not.toMatch(/(^|\s)display-none(\s|$)/);
  });
});

describe('When rendering Prose', () => {
  it('wraps typography in a max-w-prose block by default', () => {
    render(<Prose data-testid="article">terms body</Prose>);
    expect(screen.getByTestId('article')).toHaveClass('max-w-prose');
  });
});
