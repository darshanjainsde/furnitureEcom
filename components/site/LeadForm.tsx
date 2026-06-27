"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Values = {
  name: string;
  phone: string;
  email?: string;
  message?: string;
  website?: string; // honeypot
};

export function LeadForm({
  source = "home",
  productId,
  productTitle,
  variant = "full",
  tone = "light",
  ctaLabel = "Request a free consultation",
  onDone,
}: {
  source?: "home" | "product" | "category" | "contact";
  productId?: string;
  productTitle?: string;
  variant?: "compact" | "full" | "card";
  tone?: "light" | "dark";
  ctaLabel?: string;
  onDone?: () => void;
}) {
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<Values>();

  const dark = tone === "dark";
  const fieldCls = cn(
    "w-full rounded-xl border px-4 py-3 text-sm outline-none transition placeholder:text-muted/70",
    dark
      ? "border-cream/25 bg-cream/10 text-cream placeholder:text-cream/50 focus:border-cream/60 focus:ring-2 focus:ring-cream/20"
      : "border-ink/12 bg-white text-ink focus:border-green focus:ring-2 focus:ring-green/15",
  );
  const labelCls = cn("mb-1 block text-xs font-medium", dark ? "text-cream/80" : "text-ink/70");

  async function onSubmit(values: Values) {
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          source,
          productId: productId ?? "",
          message:
            values.message ||
            (productTitle ? `Enquiry about: ${productTitle}` : undefined),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError("phone", { message: data?.error || "Something went wrong. Please try again." });
        return;
      }
      setDone(true);
      onDone?.();
    } catch {
      setError("phone", { message: "Network error. Please try again." });
    }
  }

  if (done) {
    return (
      <div
        className={cn(
          "flex flex-col items-center gap-3 rounded-2xl px-6 py-8 text-center",
          dark ? "bg-cream/10 text-cream" : "bg-green/6 text-ink",
        )}
      >
        <CheckCircle2 className="h-10 w-10 text-green" />
        <p className="font-serif text-2xl">Thank you!</p>
        <p className={cn("text-sm", dark ? "text-cream/80" : "text-muted")}>
          Our design team will reach out to you shortly to plan your space.
        </p>
      </div>
    );
  }

  const inline = variant === "compact";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn(inline ? "flex flex-col gap-3 sm:flex-row sm:items-start" : "grid gap-4")}
      noValidate
    >
      {/* honeypot */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
        aria-hidden
        {...register("website")}
      />

      <div className={inline ? "flex-1" : ""}>
        {!inline && <label className={labelCls}>Your name</label>}
        <input
          className={fieldCls}
          placeholder="Your name"
          {...register("name", { required: "Enter your name", minLength: { value: 2, message: "Enter your name" } })}
        />
        {errors.name && <p className="mt-1 text-xs text-walnut">{errors.name.message}</p>}
      </div>

      <div className={inline ? "flex-1" : ""}>
        {!inline && <label className={labelCls}>Mobile number</label>}
        <input
          className={fieldCls}
          inputMode="tel"
          placeholder="Mobile number"
          {...register("phone", {
            required: "Enter your mobile number",
            pattern: { value: /^[0-9+\-\s()]{7,20}$/, message: "Enter a valid number" },
          })}
        />
        {errors.phone && <p className="mt-1 text-xs text-walnut">{errors.phone.message}</p>}
      </div>

      {variant === "full" && (
        <>
          <div>
            <label className={labelCls}>Email (optional)</label>
            <input className={fieldCls} placeholder="you@email.com" {...register("email")} />
          </div>
          <div>
            <label className={labelCls}>Tell us about your space (optional)</label>
            <textarea
              className={cn(fieldCls, "min-h-24 resize-y")}
              placeholder="e.g. 3BHK, need modular kitchen + wardrobes"
              {...register("message")}
            />
          </div>
        </>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          "inline-flex h-12 items-center justify-center gap-2 rounded-full px-7 text-sm font-medium transition disabled:opacity-60",
          dark ? "bg-cream text-green hover:bg-white" : "bg-green text-cream hover:bg-green-700",
          inline ? "shrink-0" : "mt-1",
        )}
      >
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {ctaLabel}
      </button>

      {variant !== "compact" && (
        <p className={cn("text-[11px]", dark ? "text-cream/60" : "text-muted")}>
          By submitting, you agree to be contacted about your enquiry. We never share your details.
        </p>
      )}
    </form>
  );
}
