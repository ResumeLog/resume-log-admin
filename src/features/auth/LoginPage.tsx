import { useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { ApiError } from "@/lib/api";
import { Button, Field, Input } from "@/lib/components";
import { useLogin } from "./api";

function errorMessage(error: unknown): string {
  if (error instanceof ApiError && error.status === 401) return "Wrong username or password.";
  if (error instanceof ApiError) return error.message;
  return "Can't reach the server. Try again.";
}

export function LoginPage() {
  const navigate = useNavigate();
  const login = useLogin();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    login.mutate(
      { username, password },
      { onSuccess: () => void navigate({ to: "/", replace: true }) },
    );
  };

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-elevation-surface-sunken px-4 py-8">
      <form
        onSubmit={submit}
        className="flex w-full max-w-[360px] flex-col gap-6 rounded-xxlarge border border-border-subtle bg-elevation-surface p-6"
      >
        <div className="flex flex-col items-center gap-3">
          <Logo className="gap-1" />
          <h1 className="font-semibold text-medium-large leading-6 tracking-tightest">Admin sign in</h1>
        </div>
        <div className="flex flex-col gap-3">
          <Field label="Username" htmlFor="username" required>
            <Input
              id="username"
              autoComplete="username"
              autoFocus
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Field>
          <Field label="Password" htmlFor="password" required>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>
        </div>
        {login.isError && (
          <p role="alert" className="font-medium text-small leading-5 text-text-danger">
            {errorMessage(login.error)}
          </p>
        )}
        <Button type="submit" size="xlarge" className="w-full" disabled={login.isPending}>
          {login.isPending ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </div>
  );
}
