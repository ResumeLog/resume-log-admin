import { useEffect, useRef, type ComponentProps, type ReactNode } from "react";
import CloseIcon from "../../foundations/icons/mono/close.svg?react";
import { cn } from "../../utils/cn";
import { IconButton } from "../IconButton";

export type DialogProps = Omit<ComponentProps<"dialog">, "open" | "title"> & {
  /** Whether the dialog is showing. It opens as a modal. */
  open: boolean;
  /** Called when the user presses Esc or the close button. */
  onClose: () => void;
  /** Shown in the header. Also names the dialog for screen readers. */
  title: string;
  /** 16×16 icon before the title, such as the record's icon. */
  icon?: ReactNode;
  /** Actions at the bottom right, such as the primary button. */
  footer?: ReactNode;
};

export function Dialog({ open, onClose, title, icon, footer, className, children, ...props }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = `${props.id ?? "dialog"}-title`;

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onKeyDown={(event) => {
        if (event.key !== "Escape" || event.defaultPrevented) return;
        event.preventDefault();
        onClose();
      }}
      className={cn("mx-auto mt-[14dvh] mb-auto max-h-[calc(86dvh-16px)] overflow-visible bg-transparent p-[0] backdrop:bg-transparent", className)}
      {...props}
    >
      <div className="flex h-full flex-col rounded-xxlarge bg-background-overlay p-0-75 shadow-[0_8px_28px_-6px_rgba(28,40,64,0.12),0_18px_88px_-4px_rgba(28,40,64,0.16),0_0_1px_0_rgba(28,40,64,0.16)] backdrop-blur-[15px]">
        <div className="flex min-h-[0] flex-1 flex-col overflow-clip rounded-xlarge bg-elevation-surface shadow-[0_0_0_1px_var(--color-border-subtle)]">
          <header className="flex w-full items-center justify-between p-2 shadow-[inset_0_-1px_0_0_var(--color-border-default)]">
            <h2
              id={titleId}
              className="flex h-5 items-center gap-1-5 px-1 py-0-5 font-sans font-medium text-small leading-5 tracking-tight text-text-default"
            >
              {icon && <span aria-hidden className="inline-flex size-4 shrink-0">{icon}</span>}
              {title}
            </h2>
            <IconButton icon={<CloseIcon />} aria-label="Close" onClick={onClose} />
          </header>
          <div className="min-h-[0] flex-1 overflow-y-auto">{children}</div>
          {footer && (
            <footer className="flex h-11 w-full shrink-0 items-center justify-end gap-2 border-t border-border-default pr-2 pl-3">
              {footer}
            </footer>
          )}
        </div>
      </div>
    </dialog>
  );
}
