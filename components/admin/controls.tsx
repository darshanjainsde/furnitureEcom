"use client";

import { useState, useRef, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, Plus, Trash2, Upload, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function SubmitButton({
  children = "Save",
  variant = "primary",
  className,
}: {
  children?: ReactNode;
  variant?: "primary" | "soft";
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium transition disabled:opacity-60",
        variant === "primary" ? "bg-green text-cream hover:bg-green-700" : "bg-green/10 text-green hover:bg-green/15",
        className,
      )}
    >
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}

export function DeleteButton({
  action,
  id,
  confirmText = "Delete this item? This cannot be undone.",
  label,
}: {
  action: (fd: FormData) => void | Promise<void>;
  id: string;
  confirmText?: string;
  label?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(confirmText)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-walnut hover:bg-walnut/10"
      >
        <Trash2 className="h-3.5 w-3.5" /> {label ?? "Delete"}
      </button>
    </form>
  );
}

/**
 * Delete control for use INSIDE an existing <form> that already carries a hidden
 * `id` field. Uses `formAction` to override the form's action — avoids an
 * (invalid) nested <form>.
 */
export function DeleteSubmit({
  action,
  confirmText = "Delete this item? This cannot be undone.",
  label,
}: {
  action: (fd: FormData) => void | Promise<void>;
  confirmText?: string;
  label?: string;
}) {
  return (
    <button
      type="submit"
      formAction={action}
      formNoValidate
      onClick={(e) => {
        if (!confirm(confirmText)) e.preventDefault();
      }}
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-walnut hover:bg-walnut/10"
    >
      <Trash2 className="h-3.5 w-3.5" /> {label ?? "Delete"}
    </button>
  );
}

export function Collapsible({ label, children }: { label: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-dashed border-green/30 bg-green/4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-5 py-3.5 text-sm font-medium text-green"
      >
        <span className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> {label}
        </span>
        <ChevronDown className={cn("h-4 w-4 transition", open && "rotate-180")} />
      </button>
      {open && <div className="border-t border-green/15 p-5">{children}</div>}
    </div>
  );
}

export function ImageUploader({
  name,
  multiple = false,
  initial = [],
}: {
  name: string;
  multiple?: boolean;
  initial?: string[];
}) {
  const [urls, setUrls] = useState<string[]>(initial);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function onFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    setErr(null);
    const next = [...urls];
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      try {
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Upload failed");
        if (multiple) next.push(data.url);
        else next.splice(0, next.length, data.url);
      } catch (e) {
        setErr(e instanceof Error ? e.message : "Upload failed");
      }
    }
    setUrls(next);
    setBusy(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  const hiddenValue = multiple ? JSON.stringify(urls) : urls[0] ?? "";

  return (
    <div>
      <input type="hidden" name={name} value={hiddenValue} readOnly />
      <div className="flex flex-wrap gap-3">
        {urls.map((u, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <div key={i} className="relative h-20 w-24 overflow-hidden rounded-xl border border-ink/10 bg-cream-200">
            <img src={u} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => setUrls(urls.filter((_, j) => j !== i))}
              className="absolute right-1 top-1 rounded-full bg-ink/70 p-0.5 text-cream"
              aria-label="Remove"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex h-20 w-24 flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-ink/25 text-xs text-muted hover:border-green hover:text-green"
        >
          {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
          {busy ? "Uploading" : multiple ? "Add" : "Upload"}
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        className="hidden"
        onChange={(e) => onFiles(e.target.files)}
      />
      {err && <p className="mt-2 text-xs text-walnut">{err}</p>}
    </div>
  );
}
