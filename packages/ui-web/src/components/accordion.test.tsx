import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion';

function renderFaq(overrides: Partial<React.ComponentProps<typeof Accordion>> = {}) {
  return render(
    <Accordion type="single" collapsible {...overrides}>
      <AccordionItem value="cancellation">
        <AccordionTrigger>Can I cancel a booking?</AccordionTrigger>
        <AccordionContent>Free cancellation up to 24 hours before.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="payment">
        <AccordionTrigger>When am I charged?</AccordionTrigger>
        <AccordionContent>After the sitter confirms.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="insurance">
        <AccordionTrigger>Is my pet insured?</AccordionTrigger>
        <AccordionContent>Every booking includes veterinary cover.</AccordionContent>
      </AccordionItem>
    </Accordion>,
  );
}

describe('When rendering an Accordion for SEO', () => {
  it('keeps every AccordionContent string in the DOM while collapsed', () => {
    const { container } = renderFaq();

    for (const answer of [
      'Free cancellation up to 24 hours before.',
      'After the sitter confirms.',
      'Every booking includes veterinary cover.',
    ]) {
      expect(container.textContent).toContain(answer);
    }
  });
});

describe('When an Accordion trigger toggles', () => {
  it('flips aria-expanded and un-hides the content on activation', async () => {
    const { container } = renderFaq();
    const trigger = screen.getByRole('button', { name: /can i cancel a booking/i });
    const contentId = trigger.getAttribute('aria-controls');
    if (!contentId) throw new Error('trigger missing aria-controls');
    const content = container.querySelector<HTMLElement>(`#${CSS.escape(contentId)}`);
    if (!content) throw new Error('content element not found');

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(content).toHaveAttribute('hidden');

    await userEvent.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(content).not.toHaveAttribute('hidden');
  });

  it('collapses the previously open item in single mode', async () => {
    renderFaq();
    const cancellationTrigger = screen.getByRole('button', { name: /can i cancel a booking/i });
    const paymentTrigger = screen.getByRole('button', { name: /when am i charged/i });

    await userEvent.click(cancellationTrigger);
    await userEvent.click(paymentTrigger);

    expect(cancellationTrigger).toHaveAttribute('aria-expanded', 'false');
    expect(paymentTrigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('keeps other items open in multiple mode', async () => {
    renderFaq({ type: 'multiple', collapsible: undefined });
    const cancellationTrigger = screen.getByRole('button', { name: /can i cancel a booking/i });
    const paymentTrigger = screen.getByRole('button', { name: /when am i charged/i });

    await userEvent.click(cancellationTrigger);
    await userEvent.click(paymentTrigger);

    expect(cancellationTrigger).toHaveAttribute('aria-expanded', 'true');
    expect(paymentTrigger).toHaveAttribute('aria-expanded', 'true');
  });
});

describe('When navigating an Accordion with the keyboard', () => {
  it('moves focus down and up between triggers with the arrow keys', async () => {
    renderFaq();
    const [first, second, third] = screen.getAllByRole('button');

    if (!first || !second || !third) throw new Error('expected three triggers');

    first.focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(second).toHaveFocus();

    await userEvent.keyboard('{ArrowDown}');
    expect(third).toHaveFocus();

    await userEvent.keyboard('{ArrowUp}');
    expect(second).toHaveFocus();
  });

  it('reaches every trigger in Tab order', async () => {
    renderFaq();
    const triggers = screen.getAllByRole('button');

    await userEvent.tab();
    expect(triggers[0]).toHaveFocus();
    await userEvent.tab();
    expect(triggers[1]).toHaveFocus();
    await userEvent.tab();
    expect(triggers[2]).toHaveFocus();
  });
});
