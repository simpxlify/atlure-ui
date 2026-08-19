import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Textarea } from './textarea';

describe('When a Textarea is typed into', () => {
  it('reports every change to the caller', async () => {
    const onChangeText = vi.fn();
    render(<Textarea accessibilityLabel="About your pet" onChangeText={onChangeText} />);

    const field = screen.getByLabelText('About your pet');
    await userEvent.type(field, 'friendly');

    expect(field).toHaveValue('friendly');
    expect(onChangeText).toHaveBeenLastCalledWith('friendly');
  });
});

describe('When a Textarea is given rows', () => {
  it('honours the rows attribute on the underlying textarea', () => {
    render(<Textarea accessibilityLabel="Bio" rows={6} />);

    expect(screen.getByLabelText('Bio')).toHaveAttribute('rows', '6');
  });
});
