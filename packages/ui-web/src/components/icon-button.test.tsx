import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { IconButton } from './icon-button';

const HeartIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" data-testid="heart-icon">
    <path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.5-7 10-7 10z" />
  </svg>
);

describe('When an IconButton is pressed', () => {
  it('calls the click handler and is announced by its aria-label', async () => {
    const onClick = vi.fn();
    render(<IconButton aria-label="Add Luna to favourites" icon={<HeartIcon />} onClick={onClick} />);

    await userEvent.click(screen.getByRole('button', { name: /add luna to favourites/i }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

describe('When an IconButton is disabled', () => {
  it('ignores clicks and exposes the disabled state', async () => {
    const onClick = vi.fn();
    render(
      <IconButton
        aria-label="Add Luna to favourites"
        icon={<HeartIcon />}
        disabled
        onClick={onClick}
      />,
    );

    const button = screen.getByRole('button', { name: /add luna to favourites/i });
    await userEvent.click(button);

    expect(onClick).not.toHaveBeenCalled();
    expect(button).toBeDisabled();
  });
});

describe('When an IconButton is loading', () => {
  it('swaps the icon for a spinner, blocks clicks and announces itself busy', async () => {
    const onClick = vi.fn();
    render(
      <IconButton
        aria-label="Add Luna to favourites"
        icon={<HeartIcon />}
        isLoading
        onClick={onClick}
      />,
    );

    const button = screen.getByRole('button', { name: /add luna to favourites/i });
    await userEvent.click(button);

    expect(onClick).not.toHaveBeenCalled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toBeDisabled();
    expect(screen.queryByTestId('heart-icon')).not.toBeInTheDocument();
  });
});

describe('When an IconButton sits inside a form', () => {
  it('does not submit the form, because it defaults to type="button"', async () => {
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <IconButton aria-label="Add a pet" icon={<HeartIcon />} />
      </form>,
    );

    await userEvent.click(screen.getByRole('button', { name: /add a pet/i }));

    expect(onSubmit).not.toHaveBeenCalled();
  });
});
