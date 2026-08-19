import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FormField } from './form-field';
import { Input } from './input';
import { Textarea } from './textarea';

describe('When a FormField wraps a control with a label', () => {
  it('associates the label with the control through htmlFor', () => {
    render(
      <FormField label="Email">
        <Input />
      </FormField>,
    );

    const control = screen.getByRole('textbox');
    expect(control).toHaveAccessibleName('Email');
  });
});

describe('When a FormField has helper text and no error', () => {
  it('shows the helper text and leaves the control valid', () => {
    render(
      <FormField label="Email" helperText="We only use this for booking updates">
        <Input />
      </FormField>,
    );

    expect(screen.getByText('We only use this for booking updates')).toBeTruthy();
    expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid', 'true');
  });
});

describe('When a FormField has an error', () => {
  it('replaces the helper text with the error and marks the control invalid', () => {
    render(
      <FormField label="Email" helperText="We only use this for booking updates" error="Required">
        <Input />
      </FormField>,
    );

    const control = screen.getByRole('textbox');

    expect(screen.getByText('Required')).toBeTruthy();
    expect(screen.queryByText('We only use this for booking updates')).toBeNull();
    expect(control).toHaveAttribute('aria-invalid', 'true');
    expect(control).toHaveAccessibleDescription('Required');
  });
});

describe('When a FormField is disabled', () => {
  it('disables the wrapped control', () => {
    render(
      <FormField label="About your pet" isDisabled>
        <Textarea />
      </FormField>,
    );

    expect(screen.getByRole('textbox')).toBeDisabled();
  });
});

describe('When a FormField renders its inline variant', () => {
  it('renders an internal Input wired to the label and error', () => {
    render(
      <FormField
        variant="inline"
        label="Email"
        error="Required"
        value="hi@example.com"
        placeholder="name@example.com"
        onChangeText={() => undefined}
      />,
    );

    const control = screen.getByRole('textbox') as HTMLInputElement;

    expect(control).toHaveAccessibleName('Email');
    expect(control).toHaveAttribute('aria-invalid', 'true');
    expect(control).toHaveAccessibleDescription('Required');
    expect(control).toHaveAttribute('placeholder', 'name@example.com');
    expect(control.value).toBe('hi@example.com');
  });
});

describe('When a FormField has a testID', () => {
  it('exposes error and help messages under composed testIDs', () => {
    const { rerender } = render(
      <FormField label="Email" helperText="Helpful" testID="signup">
        <Input />
      </FormField>,
    );

    expect(screen.getByTestId('signup-help')).toHaveTextContent('Helpful');

    rerender(
      <FormField label="Email" error="Required" testID="signup">
        <Input />
      </FormField>,
    );

    expect(screen.getByTestId('signup-error')).toHaveTextContent('Required');
  });
});
