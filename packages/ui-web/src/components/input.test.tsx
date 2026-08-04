import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Input } from './input';

describe('When rendering an Input with a label', () => {
  it('associates the label with the control and accepts typing', async () => {
    render(<Input label="Email" />);

    const field = screen.getByLabelText(/email/i);
    await userEvent.type(field, 'sitter@atlure.eu');

    expect(field).toHaveValue('sitter@atlure.eu');
  });

  it('describes the control with the hint', () => {
    render(<Input label="Email" hint="We only use this to confirm your booking" />);

    expect(screen.getByLabelText(/email/i)).toHaveAccessibleDescription(
      /we only use this to confirm your booking/i,
    );
  });
});

describe('When an Input has an error', () => {
  it('marks the control invalid, announces the error and hides the hint', () => {
    render(<Input label="Email" hint="Work address is fine" errorMessage="Enter a valid email" />);

    const field = screen.getByLabelText(/email/i);

    expect(field).toHaveAttribute('aria-invalid', 'true');
    expect(field).toHaveAccessibleDescription(/enter a valid email/i);
    expect(screen.getByRole('alert')).toHaveTextContent(/enter a valid email/i);
    expect(screen.queryByText(/work address is fine/i)).not.toBeInTheDocument();
  });
});

describe('When an Input is disabled', () => {
  it('rejects typing', async () => {
    render(<Input label="Email" disabled />);

    const field = screen.getByLabelText(/email/i);
    await userEvent.type(field, 'sitter@atlure.eu');

    expect(field).toBeDisabled();
    expect(field).toHaveValue('');
  });
});
