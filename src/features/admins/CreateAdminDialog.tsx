import { useState, type FormEvent } from "react";
import PlusIcon from "@/lib/foundations/icons/mono/plus.svg?react";
import { Button, Dialog, Field, Input } from "@/lib/components";
import { useCreateAdmin } from "./api";

const USERNAME_PATTERN = "[A-Za-z0-9._\\-]+";
const FORM_ID = "create-admin-form";

export type CreateAdminDialogProps = {
  open: boolean;
  onClose: () => void;
  /** Called with the new admin's username once it's saved. */
  onCreated: (username: string) => void;
};

/** Username and password, the same rules as the API: 3–50 of letters, digits, `.` `_` `-`; password 8+. */
export function CreateAdminDialog({ open, onClose, onCreated }: CreateAdminDialogProps) {
  const create = useCreateAdmin();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const close = () => {
    setUsername("");
    setPassword("");
    create.reset();
    onClose();
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    create.mutate(
      { username: username.trim(), password },
      {
        onSuccess: (admin) => {
          onCreated(admin.username);
          close();
        },
      },
    );
  };

  return (
    <Dialog
      id="create-admin"
      open={open}
      onClose={close}
      title="Create admin"
      icon={<PlusIcon />}
      className="w-[min(420px,calc(100vw-32px))]"
      footer={
        <>
          <Button variant="secondary" size="large" onClick={close}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID} size="large" disabled={create.isPending}>
            {create.isPending ? "Creating…" : "Create admin"}
          </Button>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={submit} className="flex flex-col gap-3 p-4">
        <Field label="Username" htmlFor="new-admin-username" required>
          <Input
            id="new-admin-username"
            autoComplete="off"
            required
            minLength={3}
            maxLength={50}
            pattern={USERNAME_PATTERN}
            title="Letters, digits, “.”, “_” and “-”"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Field>
        <Field label="Password" htmlFor="new-admin-password" required>
          <Input
            id="new-admin-password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            maxLength={200}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>
        <p className="pl-1 font-medium text-xsmall leading-4 text-text-subtle">
          Usernames are 3–50 letters, digits, “.”, “_” or “-”, and ignore case. Passwords need at least 8 characters.
          There's no password reset, so share it securely.
        </p>
        {create.isError && (
          <p role="alert" className="pl-1 font-medium text-small leading-5 text-text-danger">
            {create.error.message}
          </p>
        )}
      </form>
    </Dialog>
  );
}
