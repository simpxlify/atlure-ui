import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Badge } from './badge';
import { badgeVariants } from '../variants';

describe('When rendering a Badge', () => {
  it('renders a span containing the child text', () => {
    render(<Badge>Verified sitter</Badge>);
    const badge = screen.getByText(/verified sitter/i);
    expect(badge.tagName).toBe('SPAN');
  });

  it('applies the shared recipe classes for the default variant', () => {
    render(<Badge>Verified sitter</Badge>);
    const badge = screen.getByText(/verified sitter/i);
    expect(badge).toHaveClass(...badgeVariants({}).split(' ').filter(Boolean));
  });

  it('applies the destructive variant classes when asked', () => {
    render(<Badge variant="destructive">Booking cancelled</Badge>);
    const badge = screen.getByText(/booking cancelled/i);
    expect(badge).toHaveClass(
      ...badgeVariants({ variant: 'destructive' }).split(' ').filter(Boolean),
    );
  });

  it('merges caller-supplied className without dropping recipe classes', () => {
    render(<Badge className="uppercase">Verified sitter</Badge>);
    const badge = screen.getByText(/verified sitter/i);
    expect(badge).toHaveClass('uppercase');
    expect(badge.className).toContain('bg-primary');
  });
});
