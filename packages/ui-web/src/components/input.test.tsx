import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Input } from './input';

describe('When an Input is uncontrolled', () => {
  it('accepts typing and reports each change through onChangeText', async () => {
    const onChangeText = vi.fn();
    render(<Input accessibilityLabel="Search sitters" onChangeText={onChangeText} />);

    const field = screen.getByLabelText('Search sitters');
    await userEvent.type(field, 'Lisbon');

    expect(field).toHaveValue('Lisbon');
    expect(onChangeText).toHaveBeenLastCalledWith('Lisbon');
  });
});

describe('When an Input is controlled', () => {
  it('renders the value the caller provides', async () => {
    function Controlled() {
      const [value, setValue] = useState('Porto');
      return (
        <Input accessibilityLabel="City" value={value} onChangeText={setValue} />
      );
    }
    render(<Controlled />);

    const field = screen.getByLabelText('City');
    expect(field).toHaveValue('Porto');

    await userEvent.clear(field);
    await userEvent.type(field, 'Braga');
    expect(field).toHaveValue('Braga');
  });
});

describe('When an Input is disabled', () => {
  it('rejects typing and announces the disabled state', async () => {
    render(<Input accessibilityLabel="Email" isDisabled />);

    const field = screen.getByLabelText('Email');
    await userEvent.type(field, 'nope');

    expect(field).toBeDisabled();
    expect(field).toHaveAttribute('aria-disabled', 'true');
    expect(field).toHaveValue('');
  });
});

describe('When an Input is invalid', () => {
  it('announces the invalid state', () => {
    render(<Input accessibilityLabel="Email" isInvalid />);

    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true');
  });
});

describe('When an Input is given a testID', () => {
  it('maps it onto data-testid', () => {
    render(<Input accessibilityLabel="Email" testID="signup-email" />);

    expect(screen.getByTestId('signup-email')).toBe(screen.getByLabelText('Email'));
  });
});
