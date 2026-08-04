import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './button';

describe('When rendering a Button', () => {
  it('calls the click handler when activated with the mouse', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Book a sitter</Button>);

    await userEvent.click(screen.getByRole('button', { name: /book a sitter/i }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('calls the click handler when activated with the keyboard', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Book a sitter</Button>);

    await userEvent.tab();
    await userEvent.keyboard('{Enter}');

    expect(screen.getByRole('button', { name: /book a sitter/i })).toHaveFocus();
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('ignores clicks while disabled', async () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Book a sitter
      </Button>,
    );

    await userEvent.click(screen.getByRole('button', { name: /book a sitter/i }));

    expect(onClick).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: /book a sitter/i })).toBeDisabled();
  });
});

describe('When a Button is loading', () => {
  it('marks itself busy, blocks interaction and announces the loading label', async () => {
    const onClick = vi.fn();
    render(
      <Button isLoading loadingLabel="Sending your request" onClick={onClick}>
        Book a sitter
      </Button>,
    );

    const button = screen.getByRole('button', { name: /book a sitter sending your request/i });
    await userEvent.click(button);

    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toBeDisabled();
    expect(onClick).not.toHaveBeenCalled();
  });
});

describe('When a Button renders asChild', () => {
  it('renders the child element instead of a button', () => {
    render(
      <Button asChild>
        <a href="/sitters">Find sitters</a>
      </Button>,
    );

    expect(screen.getByRole('link', { name: /find sitters/i })).toHaveAttribute('href', '/sitters');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
