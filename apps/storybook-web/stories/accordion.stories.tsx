import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  type AccordionProps,
} from '@atlure/ui-web';
import type { Meta, StoryObj } from '@storybook/react-vite';

const faq = [
  {
    value: 'cancellation',
    question: 'Can I cancel a booking?',
    answer: 'Cancel free of charge up to 24 hours before the booking starts.',
  },
  {
    value: 'payment',
    question: 'When am I charged?',
    answer: 'Your card is charged once the sitter confirms, never before.',
  },
  {
    value: 'insurance',
    question: 'Is my pet insured?',
    answer: 'Every booking made through Atlure includes veterinary cover for the whole stay.',
  },
  {
    value: 'meet-and-greet',
    question: 'Can I meet the sitter first?',
    answer: 'Yes. Every sitter offers a free meet-and-greet before the first booking is confirmed.',
  },
  {
    value: 'vet-checks',
    question: 'How are sitters vetted?',
    answer: 'Identity check, in-home visit and reference calls with two prior owners.',
  },
  {
    value: 'multiple-pets',
    question: 'Can I book for more than one pet?',
    answer: 'Yes — add each pet from your profile before you request the booking.',
  },
  {
    value: 'photos',
    question: 'Do I get updates while I am away?',
    answer: 'Sitters send a photo update at least once a day for every booking longer than 24 hours.',
  },
  {
    value: 'refunds',
    question: 'What if the sitter cancels?',
    answer: 'You receive a full refund and we surface at least three replacement sitters within an hour.',
  },
  {
    value: 'contact',
    question: 'How do I contact support?',
    answer: 'Reply to any booking email — the reply lands directly in the Atlure support inbox, 07:00 to 22:00 CET.',
  },
];

function renderFaq(args: AccordionProps) {
  return (
    <Accordion {...args}>
      {faq.map(({ value, question, answer }) => (
        <AccordionItem key={value} value={value}>
          <AccordionTrigger>{question}</AccordionTrigger>
          <AccordionContent>{answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

const meta: Meta<AccordionProps> = {
  title: 'Web/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['bordered', 'plain'] },
  },
  decorators: [
    (Story) => (
      <div className="max-w-xl">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<AccordionProps>;

export const Single: Story = {
  args: {
    type: 'single',
    collapsible: true,
  },
  render: renderFaq,
};

export const Multiple: Story = {
  args: {
    type: 'multiple',
  },
  render: renderFaq,
};

export const DefaultOpen: Story = {
  args: {
    type: 'single',
    collapsible: true,
    defaultValue: 'payment',
  },
  render: renderFaq,
};

export const Plain: Story = {
  args: {
    type: 'single',
    collapsible: true,
    variant: 'plain',
  },
  render: renderFaq,
};

export const WithDisabledItem: Story = {
  args: {
    type: 'single',
    collapsible: true,
  },
  render: (args: AccordionProps) => (
    <Accordion {...args}>
      <AccordionItem value="cancellation">
        <AccordionTrigger>Can I cancel a booking?</AccordionTrigger>
        <AccordionContent>
          Cancel free of charge up to 24 hours before the booking starts.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="pricing" disabled>
        <AccordionTrigger>Country-specific pricing</AccordionTrigger>
        <AccordionContent>Not available in your region yet.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};
