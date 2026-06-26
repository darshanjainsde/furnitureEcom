"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function ProductGallery({ images, title }: { images: string[]; title: string }) {
  const pics = images.length ? images : ["/seed/1-living-room.svg"];
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-white shadow-sm">
        <Image src={pics[active]} alt={title} fill className="object-cover" priority />
      </div>
      {pics.length > 1 && (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
          {pics.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={cn(
                "relative h-20 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition",
                i === active ? "border-green" : "border-transparent opacity-70 hover:opacity-100",
              )}
            >
              <Image src={src} alt={`${title} ${i + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
