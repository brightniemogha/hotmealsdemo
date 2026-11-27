import { useEffect, useState } from "react";
import { cn } from "../utils/cn";

// Reads from /public/photos by file name. If a file is missing the
// component falls back to a warm brown gradient with the dish name.
const DRINKS: Record<string, { bg: string; body: string; label: string; text: string; cap: string; name: string }> = {
  "coke.jpg": { bg: "linear-gradient(160deg,#5a0b10,#d6232a)", body: "#2b0f0c", label: "#d6232a", text: "#fff", cap: "#d6232a", name: "Coke" },
  "sprite.jpg": { bg: "linear-gradient(160deg,#0f7a3c,#9bd94f)", body: "#d4f0d2", label: "#1e9e4a", text: "#fff", cap: "#1e9e4a", name: "Sprite" },
  "fanta.jpg": { bg: "linear-gradient(160deg,#f26b1d,#ffc93c)", body: "#f7931e", label: "#f26b1d", text: "#fff", cap: "#f26b1d", name: "Fanta" },
  "la-casera.jpg": { bg: "linear-gradient(160deg,#c9a800,#9bd94f)", body: "#e3f58a", label: "#2e8b3a", text: "#fff", cap: "#2e8b3a", name: "La Casera" },
  "nutri-milk.jpg": { bg: "linear-gradient(160deg,#cfe0ff,#ffffff)", body: "#ffffff", label: "#2b6cdf", text: "#fff", cap: "#2b6cdf", name: "Nutri Milk" },
};

function DrinkArt({ d, className }: { d: (typeof DRINKS)[string]; className?: string }) {
  return (
    <div className={cn("flex h-full w-full items-center justify-center", className)} style={{ background: d.bg }}>
      <svg viewBox="0 0 100 100" className="h-full w-full" role="img" aria-label={d.name}>
        <ellipse cx="50" cy="94" rx="20" ry="3" fill="#000" opacity="0.18" />
        <rect x="44" y="8" width="12" height="6" rx="2" fill={d.cap} />
        <path d="M45 14h10v14c0 6 12 10 12 22v36a6 6 0 0 1-6 6H39a6 6 0 0 1-6-6V50c0-12 12-16 12-22z" fill={d.body} stroke="#fff" strokeOpacity="0.5" strokeWidth="0.8" />
        <rect x="33" y="52" width="34" height="24" fill={d.label} />
        <text x="50" y="66.5" textAnchor="middle" fontSize={d.name.length > 6 ? 6 : 8} fontWeight="800" fill={d.text} fontFamily="Plus Jakarta Sans, sans-serif">{d.name}</text>
        <rect x="38" y="34" width="3.5" height="50" rx="1.7" fill="#fff" opacity="0.28" />
      </svg>
    </div>
  );
}

export function Photo({
  name,
  alt,
  className,
  labelClass,
}: {
  name: string;
  alt?: string;
  className?: string;
  labelClass?: string;
}) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [name]);

  const drink = DRINKS[name];
  if (drink) return <DrinkArt d={drink} className={className} />;

  if (failed) {
    return (
      <div
        className={cn(
          "flex h-full w-full items-center justify-center bg-gradient-to-br from-[#8a5a33] via-[#5f3b22] to-cocoa p-2",
          className
        )}
      >
        <span className={cn("text-center font-display font-semibold leading-tight text-cream/90", labelClass)}>
          {alt ?? name.replace(/-/g, " ")}
        </span>
      </div>
    );
  }

  return (
    <img
      src={`photos/${name}`}
      alt={alt ?? name}
      loading="lazy"
      draggable={false}
      onError={() => setFailed(true)}
      className={cn("h-full w-full select-none object-cover", className)}
    />
  );
}
