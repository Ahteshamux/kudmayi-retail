"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { signIn, type LoginState } from "@/app/login/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="u-btn u-caps w-full">
      {pending ? "Signing in…" : "Sign in"}
    </button>
  );
}

/**
 * Deliberately imports no Supabase code — auth runs in the server action, so
 * this stays a few hundred bytes rather than shipping the whole client.
 */
export function LoginForm() {
  const [state, formAction] = useActionState<LoginState, FormData>(signIn, {
    error: null,
  });

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="email" className="u-caps text-muted block">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          inputMode="email"
          autoCapitalize="none"
          autoCorrect="off"
          required
          className="u-field"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="u-caps text-muted block">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="u-field"
        />
      </div>

      {state.error && (
        <p role="alert" className="text-rust text-sm">
          {state.error}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
