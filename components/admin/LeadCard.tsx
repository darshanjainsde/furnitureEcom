import { Phone, MessageCircle, Mail } from "lucide-react";
import { updateLeadStatus, updateLeadNotes, deleteLead } from "@/app/actions/business";
import { SubmitButton, DeleteButton } from "@/components/admin/controls";
import { Card, inputCls } from "@/components/admin/ui";
import { formatDate, waLink, cn } from "@/lib/utils";

type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  message: string | null;
  source: string;
  status: string;
  notes: string | null;
  createdAt: Date;
  product?: { title: string } | null;
};

const STATUS_STYLE: Record<string, string> = {
  NEW: "bg-walnut/15 text-walnut",
  CONTACTED: "bg-green/12 text-green",
  CLOSED: "bg-ink/10 text-ink/60",
};

export function LeadCard({ lead }: { lead: Lead }) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-xl text-ink">{lead.name}</h3>
            <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium", STATUS_STYLE[lead.status])}>
              {lead.status}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-muted">
            {formatDate(lead.createdAt)} · via {lead.source}
            {lead.product ? ` · ${lead.product.title}` : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <a href={`tel:${lead.phone.replace(/\s/g, "")}`} className="inline-flex h-9 items-center gap-1.5 rounded-full bg-green/10 px-3 text-xs font-medium text-green hover:bg-green/15">
            <Phone className="h-3.5 w-3.5" /> Call
          </a>
          <a href={waLink(lead.phone)} target="_blank" rel="noreferrer" className="inline-flex h-9 items-center gap-1.5 rounded-full bg-[#25D366]/15 px-3 text-xs font-medium text-[#1c9c4d] hover:bg-[#25D366]/25">
            <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
          </a>
        </div>
      </div>

      <div className="mt-3 space-y-1 text-sm text-ink/80">
        <p className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-muted" /> {lead.phone}</p>
        {lead.email && <p className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-muted" /> {lead.email}</p>}
        {lead.message && <p className="rounded-lg bg-cream-200 px-3 py-2 text-ink/75">“{lead.message}”</p>}
      </div>

      <div className="mt-4 grid gap-3 border-t border-ink/8 pt-4 sm:grid-cols-2">
        <form action={updateLeadStatus} className="flex items-end gap-2">
          <input type="hidden" name="id" value={lead.id} />
          <label className="flex-1">
            <span className="mb-1 block text-xs font-medium text-ink/70">Status</span>
            <select name="status" defaultValue={lead.status} className={inputCls}>
              <option value="NEW">New</option>
              <option value="CONTACTED">Contacted</option>
              <option value="CLOSED">Closed</option>
            </select>
          </label>
          <SubmitButton variant="soft">Update</SubmitButton>
        </form>

        <form action={updateLeadNotes} className="flex items-end gap-2">
          <input type="hidden" name="id" value={lead.id} />
          <label className="flex-1">
            <span className="mb-1 block text-xs font-medium text-ink/70">Notes</span>
            <input name="notes" defaultValue={lead.notes ?? ""} className={inputCls} placeholder="Add a note…" />
          </label>
          <SubmitButton variant="soft">Save</SubmitButton>
        </form>
      </div>

      <div className="mt-3 flex justify-end">
        <DeleteButton action={deleteLead} id={lead.id} confirmText="Delete this lead permanently?" />
      </div>
    </Card>
  );
}
