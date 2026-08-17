import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useId,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
} from 'react';
import { cn } from '../lib/cn';
import {
  accordionContentClassName,
  accordionItemClassName,
  accordionTriggerClassName,
  accordionVariants,
  type AccordionVariantProps,
} from '../variants';
import { ChevronDown } from './chevron-down';

export type AccordionMode = 'single' | 'multiple';

export interface AccordionProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'>,
    AccordionVariantProps {
  type: AccordionMode;
  collapsible?: boolean;
  value?: string | string[] | null;
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[] | null) => void;
}

type AccordionContextValue = {
  isOpen: (value: string) => boolean;
  toggle: (value: string) => void;
  registerTrigger: (value: string, node: HTMLButtonElement | null) => void;
  focusTrigger: (value: string, direction: 1 | -1 | 'home' | 'end') => void;
};

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordion(component: string): AccordionContextValue {
  const context = useContext(AccordionContext);
  if (!context) throw new Error(`${component} must be rendered inside an <Accordion>`);
  return context;
}

function asArray(value: string | string[] | null | undefined): string[] {
  if (value == null) return [];
  return Array.isArray(value) ? value : [value];
}

export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(function Accordion(
  {
    className,
    variant,
    children,
    type,
    collapsible = false,
    value,
    defaultValue,
    onValueChange,
    ...divProps
  },
  ref,
) {
  const isMultiple = type === 'multiple';
  const [uncontrolled, setUncontrolled] = useState<string[]>(() => asArray(defaultValue));

  const currentList = value !== undefined ? asArray(value) : uncontrolled;
  const openSet = useMemo(() => new Set(currentList), [currentList]);

  const triggersRef = useRef(new Map<string, HTMLButtonElement>());
  const orderRef = useRef<string[]>([]);

  const registerTrigger = useCallback((triggerValue: string, node: HTMLButtonElement | null) => {
    if (node) {
      triggersRef.current.set(triggerValue, node);
      if (!orderRef.current.includes(triggerValue)) orderRef.current.push(triggerValue);
    } else {
      triggersRef.current.delete(triggerValue);
      orderRef.current = orderRef.current.filter((entry) => entry !== triggerValue);
    }
  }, []);

  const emitChange = useCallback(
    (nextList: string[]) => {
      if (value === undefined) setUncontrolled(nextList);
      if (!onValueChange) return;
      if (isMultiple) onValueChange(nextList);
      else onValueChange(nextList[0] ?? null);
    },
    [isMultiple, onValueChange, value],
  );

  const toggle = useCallback(
    (triggerValue: string) => {
      const isCurrentlyOpen = openSet.has(triggerValue);
      if (isMultiple) {
        const nextList = isCurrentlyOpen
          ? currentList.filter((entry) => entry !== triggerValue)
          : [...currentList, triggerValue];
        emitChange(nextList);
        return;
      }
      let nextList: string[];
      if (isCurrentlyOpen) nextList = collapsible ? [] : currentList;
      else nextList = [triggerValue];
      emitChange(nextList);
    },
    [collapsible, currentList, emitChange, isMultiple, openSet],
  );

  const focusTrigger = useCallback(
    (triggerValue: string, direction: 1 | -1 | 'home' | 'end') => {
      const order = orderRef.current;
      const currentIndex = order.indexOf(triggerValue);
      if (currentIndex === -1) return;
      let nextIndex: number;
      if (direction === 'home') nextIndex = 0;
      else if (direction === 'end') nextIndex = order.length - 1;
      else nextIndex = (currentIndex + direction + order.length) % order.length;
      const nextValue = order[nextIndex];
      if (nextValue) triggersRef.current.get(nextValue)?.focus();
    },
    [],
  );

  const contextValue = useMemo<AccordionContextValue>(
    () => ({
      isOpen: (triggerValue) => openSet.has(triggerValue),
      toggle,
      registerTrigger,
      focusTrigger,
    }),
    [openSet, toggle, registerTrigger, focusTrigger],
  );

  return (
    <AccordionContext.Provider value={contextValue}>
      <div ref={ref} className={cn(accordionVariants({ variant }), className)} {...divProps}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
});

type AccordionItemContextValue = {
  value: string;
  disabled: boolean;
  triggerId: string;
  contentId: string;
};

const AccordionItemContext = createContext<AccordionItemContextValue | null>(null);

function useAccordionItem(component: string): AccordionItemContextValue {
  const context = useContext(AccordionItemContext);
  if (!context) throw new Error(`${component} must be rendered inside an <AccordionItem>`);
  return context;
}

export interface AccordionItemProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  disabled?: boolean;
}

export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(function AccordionItem(
  { className, value, disabled = false, children, ...props },
  ref,
) {
  const generatedId = useId();
  const itemContext = useMemo<AccordionItemContextValue>(
    () => ({
      value,
      disabled,
      triggerId: `accordion-trigger-${generatedId}`,
      contentId: `accordion-content-${generatedId}`,
    }),
    [value, disabled, generatedId],
  );

  return (
    <AccordionItemContext.Provider value={itemContext}>
      <div ref={ref} data-value={value} className={cn(accordionItemClassName, className)} {...props}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
});

export interface AccordionTriggerProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {}

export const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  function AccordionTrigger({ className, children, onClick, onKeyDown, ...props }, ref) {
    const accordion = useAccordion('AccordionTrigger');
    const item = useAccordionItem('AccordionTrigger');
    const isOpen = accordion.isOpen(item.value);

    const setRef = useCallback(
      (node: HTMLButtonElement | null) => {
        accordion.registerTrigger(item.value, node);
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      },
      [accordion, item.value, ref],
    );

    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented) return;
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        accordion.focusTrigger(item.value, 1);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        accordion.focusTrigger(item.value, -1);
      } else if (event.key === 'Home') {
        event.preventDefault();
        accordion.focusTrigger(item.value, 'home');
      } else if (event.key === 'End') {
        event.preventDefault();
        accordion.focusTrigger(item.value, 'end');
      }
    };

    return (
      <h3 className="flex">
        <button
          ref={setRef}
          type="button"
          id={item.triggerId}
          aria-expanded={isOpen}
          aria-controls={item.contentId}
          disabled={item.disabled}
          data-state={isOpen ? 'open' : 'closed'}
          className={cn(accordionTriggerClassName, 'flex-1', className)}
          onClick={(event) => {
            onClick?.(event);
            if (!event.defaultPrevented) accordion.toggle(item.value);
          }}
          onKeyDown={handleKeyDown}
          {...props}
        >
          {children}
          <ChevronDown className="shrink-0 transition-transform duration-200 [[data-state=open]_&]:rotate-180" />
        </button>
      </h3>
    );
  },
);

export interface AccordionContentProps extends HTMLAttributes<HTMLDivElement> {}

export const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>(
  function AccordionContent({ className, ...props }, ref) {
    const accordion = useAccordion('AccordionContent');
    const item = useAccordionItem('AccordionContent');
    const isOpen = accordion.isOpen(item.value);

    return (
      <div
        ref={ref}
        id={item.contentId}
        role="region"
        aria-labelledby={item.triggerId}
        data-state={isOpen ? 'open' : 'closed'}
        hidden={!isOpen}
        className={cn(accordionContentClassName, className)}
        {...props}
      />
    );
  },
);
