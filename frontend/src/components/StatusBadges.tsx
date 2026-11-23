import { CheckCircle2, PauseCircle, Wrench } from "lucide-react";
import type { Wahana } from "@/lib/types";

export function LampuBadge({
  status,
}: {
  status: Wahana["status_lampu"];
}) {
  if (status === "Hijau") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#86EFAC] bg-[#DCFCE7] px-2.5 py-1 text-xs font-semibold text-[#14532D]">
        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span>Lampu Hijau · Siap</span>
      </span>
    );
  }
  if (status === "Merah") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FCA5A5] bg-[#FEE2E2] px-2.5 py-1 text-xs font-semibold text-[#7F1D1D]">
        <PauseCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span>Lampu Merah · Bermain</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#CBD5E1] bg-[#F1F5F9] px-2.5 py-1 text-xs font-semibold text-[#334155]">
      <Wrench className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>Maintenance</span>
    </span>
  );
}

export function CrowdBadge({
  crowd,
}: {
  crowd: Wahana["crowd_meter"];
}) {
  if (crowd === "Sepi") {
    return (
      <span className="inline-flex items-center rounded-full border border-[#86EFAC] bg-[#DCFCE7] px-2.5 py-1 text-xs font-semibold text-[#14532D]">
        Sepi (&lt;10 mnt)
      </span>
    );
  }
  if (crowd === "Sedang") {
    return (
      <span className="inline-flex items-center rounded-full border border-[#FCD34D] bg-[#FEF3C7] px-2.5 py-1 text-xs font-semibold text-[#78350F]">
        Sedang (10-25 mnt)
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full border border-[#FCA5A5] bg-[#FEE2E2] px-2.5 py-1 text-xs font-semibold text-[#7F1D1D]">
      Padat (&gt;30 mnt)
    </span>
  );
}
