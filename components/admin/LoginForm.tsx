"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { loginAction, type LoginState } from "@/app/actions/auth";

export function LoginForm({ role, hint }: { role: "OWNER" | "BUSINESS"; hint?: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(loginAction, {});

  return (
    <form action={action} className="grid gap-4">
      <input type="hidden" name="role" value={role} />
      <div>
        <label className="mb-1 block text-xs font-medium text-ink/70">Email</label>
        <input
          name="email"
          type="email"
          required
          autoComplete="username"
          className="w-full rounded-xl border border-ink/12 bg-white px-4 py-3 text-sm outline-none focus:border-green"
          placeholder="you@finokraft.com"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-ink/70">Password</label>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded-xl border border-ink/12 bg-white px-4 py-3 text-sm outline-none focus:border-green"
          placeholder="••••••••"
        />
      </div>
      {state.error && <p className="text-sm text-walnut">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="mt-1 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-green px-6 text-sm font-medium text-cream hover:bg-green-700 disabled:opacity-60"
      >
        {pending && <Loader2 className="h-4 w-4 animate-spin" />} Sign in
      </button>
      {hint && <p className="text-center text-xs text-muted">{hint}</p>}
    </form>
  );
}
