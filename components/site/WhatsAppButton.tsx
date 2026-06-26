"use client";

import { MessageCircle } from "lucide-react";
import { waLink } from "@/lib/utils";

export function WhatsAppButton({ whatsapp }: { whatsapp?: string | null }) {
  if (!whatsapp) return null;
  return (
    <a
      href={waLink(whatsapp, "Hi FINOKRAFT, I'd like a free design consultation.")}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105 hover:shadow-xl"
    >
      <MessageCircle className="h-7 w-7" fill="currentColor" stroke="white" />
    </a>
  );
}
