"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { LeadForm } from "./LeadForm";
import { cn } from "@/lib/utils";

export function EnquireButton({
  productId,
  productTitle,
  className,
  label = "Enquire",
  variant = "solid",
}: {
  productId?: string;
  productTitle?: string;
  className?: string;
  label?: string;
  variant?: "solid" | "outline";
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex h-10 items-center justify-center rounded-full px-5 text-sm font-medium transition",
          variant === "solid"
            ? "bg-green text-cream hover:bg-green-700"
            : "border border-green/30 text-green hover:bg-green hover:text-cream",
          className,
        )}
      >
        {label}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-ink/55 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-md rounded-t-3xl bg-cream p-6 shadow-2xl sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 rounded-full p-1.5 text-muted hover:bg-ink/5"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <p className="eyebrow text-walnut">Get a quote</p>
            <h3 className="mt-1 font-serif text-2xl text-ink">
              {productTitle ? `Enquire: ${productTitle}` : "Request a callback"}
            </h3>
            <p className="mb-4 mt-1 text-sm text-muted">
              Share your details and our team will call you back.
            </p>
            <LeadForm
              source="product"
              productId={productId}
              productTitle={productTitle}
              variant="full"
              ctaLabel="Request callback"
              onDone={() => {}}
            />
          </div>
        </div>
      )}
    </>
  );
}
