import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EmptyState } from './empty-state';
import { ErrorState } from './error-state';
import { Skeleton } from './skeleton';

describe('When rendering a Skeleton', () => {
  it('announces itself as a pending status', () => {
    render(<Skeleton />);
    const skeleton = screen.getByRole('status');
    expect(skeleton).toHaveAttribute('aria-busy', 'true');
  });

  it('applies the shape sizing classes', () => {
    render(<Skeleton shape="circle" data-testid="s" />);
    expect(screen.getByTestId('s')).toHaveClass('rounded-full');
  });
});

describe('When rendering an EmptyState', () => {
  it('exposes the heading and action', () => {
    render(
      <EmptyState
        title="No sitters yet"
        description="Try widening your search"
        action={<button type="button">Adjust filters</button>}
      />,
    );
    expect(screen.getByText(/no sitters yet/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /adjust filters/i })).toBeInTheDocument();
  });
});

describe('When rendering an ErrorState', () => {
  it('exposes an alert role so screen readers announce it', () => {
    render(<ErrorState title="Something went wrong" description="Try again in a moment" />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });
});
