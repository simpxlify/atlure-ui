import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Separator } from './separator';

describe('When rendering a Separator', () => {
  it('renders an hr exposed to the a11y tree with role="separator"', () => {
    render(<Separator data-testid="rule" />);
    const rule = screen.getByRole('separator');
    expect(rule.tagName).toBe('HR');
    expect(rule).toHaveAttribute('aria-orientation', 'horizontal');
  });

  it('reflects the requested orientation', () => {
    render(<Separator orientation="vertical" />);
    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'vertical');
  });
});
