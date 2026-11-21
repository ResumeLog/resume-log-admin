import { useRef, type ComponentProps, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "../../utils/cn";

export type TabOption<T extends string> = {
  value: T;
  label: string;
  /** Shown after the label, such as a discount badge. */
  right?: ReactNode;
};

export type TabsProps<T extends string> = Omit<ComponentProps<"div">, "onChange"> & {
  /** Names the group for screen readers, such as "Billing period". */
  label: string;
  options: TabOption<T>[];
  value: T;
  onValueChange: (value: T) => void;
};

const NEXT_KEYS = ["ArrowRight", "ArrowDown"];
const PREVIOUS_KEYS = ["ArrowLeft", "ArrowUp"];

/**
 * Segmented tabs that switch between views, such as Monthly / Annually. One option is
 * always selected. It works as a radio group: arrow keys move the selection.
 */
export function Tabs<T extends string>({ label, options, value, onValueChange, className, ...props }: TabsProps<T>) {
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (event: KeyboardEvent, index: number) => {
    const step = NEXT_KEYS.includes(event.key) ? 1 : PREVIOUS_KEYS.includes(event.key) ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const next = (index + step + options.length) % options.length;
    onValueChange(options[next].value);
    buttons.current[next]?.focus();
  };

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn("inline-flex h-7 items-start gap-0-5 rounded-larger bg-neutral-alpha-4 p-0-5", className)}
      {...props}
    >
      {options.map((option, index) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            ref={(node) => {
              buttons.current[index] = node;
            }}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onValueChange(option.value)}
            onKeyDown={(event) => onKeyDown(event, index)}
            className={cn(
              "flex h-6 cursor-pointer items-center justify-center gap-1-5 rounded-large px-2 font-sans font-medium text-small leading-5 tracking-tight whitespace-nowrap text-text-default",
              selected && "bg-elevation-surface shadow-[0_1px_2px_-1px_rgba(0,0,0,0.04)]",
            )}
          >
            {option.label}
            {option.right}
          </button>
        );
      })}
    </div>
  );
}
