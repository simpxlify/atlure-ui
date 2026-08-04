import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion';

function renderFaq() {
  return render(
    <Accordion type="single" collapsible>
      <AccordionItem value="cancellation">
        <AccordionTrigger>Can I cancel a booking?</AccordionTrigger>
        <AccordionContent>Free cancellation up to 24 hours before.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="payment">
        <AccordionTrigger>When am I charged?</AccordionTrigger>
        <AccordionContent>After the sitter confirms.</AccordionContent>
      </AccordionItem>
    </Accordion>,
  );
}

describe('When rendering an Accordion', () => {
  it('keeps every panel collapsed until a trigger is used', () => {
    renderFaq();

    expect(screen.getByRole('button', { name: /can i cancel a booking/i })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    expect(screen.queryByText(/free cancellation up to 24 hours before/i)).not.toBeInTheDocument();
  });

  it('expands the matching panel on click and collapses it again', async () => {
    renderFaq();
    const trigger = screen.getByRole('button', { name: /can i cancel a booking/i });

    await userEvent.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText(/free cancellation up to 24 hours before/i)).toBeVisible();

    await userEvent.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('collapses the open panel when another one is opened in single mode', async () => {
    renderFaq();
    const cancellationTrigger = screen.getByRole('button', { name: /can i cancel a booking/i });
    const paymentTrigger = screen.getByRole('button', { name: /when am i charged/i });

    await userEvent.click(cancellationTrigger);
    await userEvent.click(paymentTrigger);

    expect(cancellationTrigger).toHaveAttribute('aria-expanded', 'false');
    expect(paymentTrigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('moves focus between triggers with the arrow keys', async () => {
    renderFaq();

    await userEvent.tab();
    await userEvent.keyboard('{ArrowDown}');

    expect(screen.getByRole('button', { name: /when am i charged/i })).toHaveFocus();
  });
});
