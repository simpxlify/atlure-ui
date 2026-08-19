import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Input } from './input';
import { Label } from './label';

describe('When a Label is associated with a control', () => {
  it('names the control through htmlFor', () => {
    render(
      <>
        <Label htmlFor="email">Email</Label>
        <Input id="email" />
      </>,
    );

    expect(screen.getByLabelText('Email').id).toBe('email');
  });
});

describe('When a Label is marked required', () => {
  it('renders a visual asterisk hidden from the accessible name', () => {
    render(<Label isRequired>Email</Label>);

    const label = screen.getByText('Email');
    expect(label.textContent).toContain('*');
    expect(label.querySelector('[aria-hidden]')).not.toBeNull();
  });
});
