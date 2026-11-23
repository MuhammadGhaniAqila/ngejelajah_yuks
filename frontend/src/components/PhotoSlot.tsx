import { ImageIcon } from "lucide-react";

interface PhotoSlotProps {
  src?: string | null;
  alt: string;
  label?: string;
  className?: string;
}

/**
 * Renders a real raster image when provided (non-SVG photo URL/file),
 * or a calm coastal-tinted empty photo well ready to receive real Dufan photography.
 */
export function PhotoSlot({
  src,
  alt,
  label = "Foto Wahana",
  className = "",
}: PhotoSlotProps) {
  const hasRealPhoto =
    Boolean(src) &&
    !src!.endsWith(".svg") &&
    (src!.startsWith("http") || src!.startsWith("/photos/"));

  if (hasRealPhoto && src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        width={640}
        height={360}
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#EDF4FD] to-[#DCE9FA] text-center ${className}`}
      aria-label={alt}
    >
      <ImageIcon className="h-6 w-6 text-[#4B6891]" aria-hidden="true" />
      <span className="mt-1.5 px-3 text-[11px] font-medium text-[#4B6891]">
        {label}
      </span>
    </div>
  );
}
