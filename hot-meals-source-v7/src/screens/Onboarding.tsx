import { useCallback, useEffect, useRef, useState } from "react";
import { IconArrowRight, LogoPot } from "../components/Icons";
import { Photo } from "../components/Photo";
import { ONBOARDING_SLIDES } from "../data/menu";
import { cn } from "../utils/cn";

export function Onboarding({ onDone }: { onDone: () => void }) {
  const [idx, setIdx] = useState(0);
  const [dx, setDx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);
  const dxRef = useRef(0);
  const idxRef = useRef(0);
  const draggingRef = useRef(false);
  const last = ONBOARDING_SLIDES.length - 1;

  useEffect(() => {
    idxRef.current = idx;
  }, [idx]);

  const updateDx = (v: number) => {
    dxRef.current = v;
    setDx(v);
  };

  const endDrag = useCallback(() => {
    if (!draggingRef.current) return;
    const d = dxRef.current;
    const i = idxRef.current;
    if (d < -60 && i < last) setIdx(i + 1);
    if (d > 60 && i > 0) setIdx(i - 1);
    dxRef.current = 0;
    setDx(0);
    draggingRef.current = false;
    setDragging(false);
  }, [last]);

  useEffect(() => {
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);
    return () => {
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);
    };
  }, [endDrag]);

  const down = (e: React.PointerEvent) => {
    // let buttons keep their normal clicks
    if ((e.target as HTMLElement).closest("button")) return;
    startX.current = e.clientX;
    draggingRef.current = true;
    setDragging(true);
  };
  const move = (e: React.PointerEvent) => {
    if (draggingRef.current) updateDx(e.clientX - startX.current);
  };

  const next = () => {
    if (idx < last) setIdx(idx + 1);
    else onDone();
  };

  return (
    <div
      className="relative h-full overflow-hidden bg-cocoa"
      style={{ touchAction: "pan-y" }}
      onPointerDown={down}
      onPointerMove={move}
    >
      <div
        className="flex h-full w-full"
        style={{
          transform: `translateX(calc(${-idx * 100}% + ${dx}px))`,
          transition: dragging ? "none" : "transform 0.45s cubic-bezier(0.32, 0.72, 0, 1)",
        }}
      >
        {ONBOARDING_SLIDES.map((s) => (
          <div key={s.title} className="relative h-full w-full shrink-0 overflow-hidden">
            <Photo name={s.photo} alt={s.title} className="absolute inset-0" />
            <div className="absolute inset-0 bg-gradient-to-t from-cocoa via-cocoa/30 to-cocoa/10" />
            <div className="absolute inset-x-0 bottom-0 p-6 pb-40">
              <h2 className="font-display text-[34px] font-extrabold leading-[1.08] text-white">{s.title}</h2>
              <p className="mt-3 max-w-[36ch] text-[15px] leading-relaxed text-white/85">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-12 z-10 flex items-center gap-2.5 px-6">
        <LogoPot className="h-8 w-8 text-mustard" />
        <span className="font-display text-lg font-bold text-white">Hot Meals</span>
      </div>

      <button
        onClick={onDone}
        className="press absolute right-5 top-12 z-10 rounded-full bg-cocoa/30 px-4 py-2 text-sm font-bold text-white backdrop-blur-md"
      >
        Skip
      </button>

      <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between px-6 pb-[max(2rem,env(safe-area-inset-bottom))]">
        <div className="flex items-center gap-1.5">
          {ONBOARDING_SLIDES.map((s, i) => (
            <span
              key={s.title}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === idx ? "w-7 bg-mustard" : "w-2 bg-white/40"
              )}
            />
          ))}
        </div>
        <button
          onClick={next}
          className="press flex h-14 w-14 items-center justify-center rounded-full bg-flame text-white shadow-[0_14px_32px_-8px_rgba(214,35,42,0.75)]"
          aria-label="Next"
        >
          <IconArrowRight className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
