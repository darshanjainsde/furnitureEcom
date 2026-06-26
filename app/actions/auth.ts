"use server";

import { redirect } from "next/navigation";
import { authenticate, createSession, destroySession } from "@/lib/auth";

export type LoginState = { error?: string };

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const role = formData.get("role") === "OWNER" ? "OWNER" : "BUSINESS";

  const user = await authenticate(email, password, role);
  if (!user) return { error: "Invalid email or password for this portal." };

  await createSession(user);
  redirect(role === "OWNER" ? "/owner" : "/business");
}

export async function logoutAction(formData: FormData) {
  const role = formData.get("role");
  await destroySession();
  redirect(role === "OWNER" ? "/owner/login" : "/business/login");
}
