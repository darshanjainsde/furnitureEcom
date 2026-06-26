import "server-only";

type NewLead = {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  source: string;
  message?: string | null;
};

/**
 * Lead notification hook.
 * Phase 1: logs to server console (leads are always stored + shown in the Business dashboard).
 * Phase 2: wire up email (e.g. Resend/SMTP) and WhatsApp (Cloud API) here — the call sites
 * already invoke this, so no changes are needed elsewhere when it's implemented.
 */
export async function notifyNewLead(lead: NewLead): Promise<void> {
  try {
    console.log(`[new-lead] ${lead.name} · ${lead.phone} · ${lead.source}`);
    // TODO(phase-2): await sendEmail(lead); await sendWhatsApp(lead);
  } catch (err) {
    console.error("notifyNewLead failed (non-fatal):", err);
  }
}
