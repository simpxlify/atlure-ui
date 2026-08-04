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
