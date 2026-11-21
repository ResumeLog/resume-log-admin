import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../utils/cn";

export type FieldProps = Omit<ComponentProps<"div">, "children"> & {
  /** The field's name, shown above the control. */
  label: string;
  /** The `id` of the control the label belongs to. */
  htmlFor: string;
  /** Shows a red `*` after the label. Also mark the control itself as `required`. */
  required?: boolean;
  /** The control, such as an `Input` or `Select`. */
  children: ReactNode;
};

export function Field({ label, htmlFor, required = false, className, children, ...props }: FieldProps) {
  return (
    <div className={cn("flex w-full flex-col items-start gap-1", className)} {...props}>
      <label
        htmlFor={htmlFor}
        className="flex items-center pl-1 font-sans font-medium text-xsmall leading-4 text-text-subtle"
      >
        {label}
        {required && (
          <span aria-hidden className="w-[7px] text-center text-text-danger">
            *
          </span>
        )}
      </label>
      {children}
    </div>
  );
}
