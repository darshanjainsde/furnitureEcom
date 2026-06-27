"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, CalendarHeart } from "lucide-react";
import { LeadForm } from "./LeadForm";
import { cn } from "@/lib/utils";

export function EnquireButton({
  productId,
  productTitle,
  className,
  label = "Book Free Consultation",
  variant = "solid",
  full = false,
}: {
  productId?: string;
  productTitle?: string;
  className?: string;
  label?: string;
  variant?: "solid" | "outline";
  full?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

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

  const modal = (
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center bg-ink/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={() => setOpen(false)}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="fk-pop relative w-full max-w-md overflow-hidden rounded-t-3xl bg-cream shadow-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="relative bg-green px-6 pb-6 pt-7 text-cream">
          <button
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 rounded-full p-1.5 text-cream/80 transition hover:bg-cream/15 hover:text-cream"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-cream/15">
            <CalendarHeart className="h-5 w-5" strokeWidth={1.7} />
          </div>
          <p className="eyebrow text-cream/70">Free consultation</p>
          <h3 className="mt-1 font-serif text-2xl leading-tight">Book your free consultation</h3>
          {productTitle ? (
            <p className="mt-1 text-sm text-cream/80">Regarding: {productTitle}</p>
          ) : (
            <p className="mt-1 text-sm text-cream/80">A designer will call you back with ideas &amp; a quote.</p>
          )}
        </div>
        {/* body */}
        <div className="px-6 pb-6 pt-5">
          <LeadForm
            source="product"
            productId={productId}
            productTitle={productTitle}
            variant="full"
            ctaLabel="Book my consultation"
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-medium transition",
          variant === "solid"
            ? "bg-green text-cream hover:bg-green-700"
            : "border border-green/30 text-green hover:bg-green hover:text-cream",
          full && "w-full",
          className,
        )}
      >
        {label}
      </button>
      {mounted && open && createPortal(modal, document.body)}
    </>
  );
}
