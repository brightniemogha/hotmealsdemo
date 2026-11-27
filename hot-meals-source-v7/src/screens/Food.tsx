import { useMemo, useRef, useState } from "react";
import { IconArrowLeft, IconCheck, IconMinus, IconPlus } from "../components/Icons";
import { Photo } from "../components/Photo";
import { MENU } from "../data/menu";
import { useApp } from "../lib/appState";
import { naira } from "../lib/store";
import { cn } from "../utils/cn";

type Props = {
  itemId: string;
  onBack: () => void;
  onGoCart: () => void;
};

export function Food({ itemId, onBack, onGoCart }: Props) {
  const { addToCart, showToast } = useApp();
  const item = useMemo(() => MENU.find((m) => m.id === itemId), [itemId]);

  const [qty, setQty] = useState(1);
  const [extraIds, setExtraIds] = useState<string[]>([]);
  const [picks, setPicks] = useState<Record<string, string>>(() =>
    Object.fromEntries((item?.picks ?? []).map((g) => [g.id, g.options[0]]))
  );
  const [added, setAdded] = useState(false);
  const timer = useRef<number | null>(null);

  if (!item) return null;

  const extrasSum = (item.extras ?? []).filter((e) => extraIds.includes(e.id)).reduce((s, e) => s + e.price, 0);
  const unit = item.price + extrasSum;
  const total = unit * qty;

  const toggleExtra = (id: string) =>
    setExtraIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const add = () => {
    const chosen = (item.extras ?? [])
      .filter((e) => extraIds.includes(e.id))
      .map((e) => ({ name: e.name, price: e.price }));
    const labels = (item.picks ?? []).map((g) => picks[g.id]);
    addToCart({
      key: `${item.id}|${extraIds.slice().sort().join(",")}|${labels.join(",")}`,
      itemId: item.id,
      name: item.name,
      photo: item.photo,
      unitPrice: unit,
      qty,
      extras: chosen,
      picks: labels,
    });
    setAdded(true);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setAdded(false), 1400);
    showToast({
      title: "Added",
      sub: `${qty} × ${item.name}`,
      actionLabel: "View Cart",
      onAction: onGoCart,
    });
  };

  return (
    <div className="relative h-full bg-cream">
      <div className="absolute inset-x-0 top-0 h-[46%]">
        <Photo name={item.photo} alt={item.name} className="absolute inset-0" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-cream to-transparent" />
      </div>

      <button
        onClick={onBack}
        className="press absolute left-5 top-12 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-cocoa/35 text-white backdrop-blur-md"
        aria-label="Back"
      >
        <IconArrowLeft className="h-5 w-5" />
      </button>
      <span className="absolute right-5 top-12 z-20 rounded-full bg-cocoa/35 px-3.5 py-2 text-[12px] font-bold text-white backdrop-blur-md">
        {item.category}
      </span>

      <div className="anim-sheet absolute inset-x-0 bottom-0 top-[41%] flex flex-col rounded-t-[2.2rem] bg-cream">
        <div className="mx-auto mt-3 h-1.5 w-10 shrink-0 rounded-full bg-cocoa/15" />

        <div className="no-scrollbar flex-1 overflow-y-auto px-5 pt-3 pb-4">
          <div className="flex items-start justify-between gap-4">
            <h1 className="font-display text-[26px] font-extrabold leading-tight text-cocoa">{item.name}</h1>
            <span className="mt-1 shrink-0 font-display text-[21px] font-extrabold text-flame">{naira(unit)}</span>
          </div>

          <div className="mt-2 flex flex-wrap gap-1.5">
            {item.tags.map((t) => (
              <span key={t} className="rounded-full bg-mustard/25 px-2.5 py-1 text-[11.5px] font-extrabold text-cocoa">
                {t}
              </span>
            ))}
          </div>

          <p className="mt-2.5 text-[14.5px] leading-relaxed text-cocoa/65">{item.desc}</p>

          {item.extras && item.extras.length > 0 && (
            <section className="mt-6">
              <h2 className="font-display text-lg font-extrabold text-cocoa">Add extras</h2>
              <div className="mt-2.5 space-y-2.5">
                {item.extras.map((e) => {
                  const on = extraIds.includes(e.id);
                  return (
                    <button
                      key={e.id}
                      onClick={() => toggleExtra(e.id)}
                      className={cn(
                        "press flex w-full items-center gap-3 rounded-2xl p-3 text-left ring-2 transition",
                        on ? "bg-white ring-mustard" : "bg-white ring-transparent"
                      )}
                    >
                      <span className="h-12 w-12 shrink-0 overflow-hidden rounded-xl">
                        <Photo name={e.photo} alt={e.name} />
                      </span>
                      <span className="flex-1">
                        <span className="block text-[14px] font-bold text-cocoa">{e.name}</span>
                        <span className="text-[12.5px] font-extrabold text-flame">+{naira(e.price)}</span>
                      </span>
                      <span
                        className={cn(
                          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition",
                          on ? "anim-pop bg-cocoa text-cream" : "border-2 border-cocoa/20"
                        )}
                      >
                        {on && <IconCheck className="h-3.5 w-3.5" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {item.picks?.map((g) => (
            <section key={g.id} className="mt-6">
              <h2 className="font-display text-lg font-extrabold text-cocoa">{g.title}</h2>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {g.options.map((opt) => {
                  const on = picks[g.id] === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => setPicks((p) => ({ ...p, [g.id]: opt }))}
                      className={cn(
                        "press flex items-center gap-1.5 rounded-full border-2 px-4 py-2.5 text-[13.5px] font-bold",
                        on ? "border-cocoa bg-cocoa text-cream" : "border-cocoa/10 bg-white text-cocoa/80"
                      )}
                    >
                      {on && <IconCheck className="h-3.5 w-3.5" />}
                      {opt}
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-4 border-t border-cocoa/10 bg-white px-5 py-4 pb-[max(1.1rem,env(safe-area-inset-bottom))]">
          <div className="flex items-center gap-3 rounded-full bg-cream p-1.5">
            <button
              onClick={() => setQty((v) => Math.max(1, v - 1))}
              className={cn(
                "press flex h-9 w-9 items-center justify-center rounded-full bg-white text-cocoa",
                qty === 1 && "opacity-35"
              )}
              aria-label="Less"
            >
              <IconMinus className="h-4 w-4" />
            </button>
            <span key={qty} className="anim-pop w-6 text-center font-display text-lg font-extrabold text-cocoa">
              {qty}
            </span>
            <button
              onClick={() => setQty((v) => Math.min(20, v + 1))}
              className="press flex h-9 w-9 items-center justify-center rounded-full bg-cocoa text-cream"
              aria-label="More"
            >
              <IconPlus className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={add}
            className={cn(
              "press flex flex-1 items-center justify-between rounded-full px-6 py-4 font-display text-[15px] font-bold text-white",
              added ? "bg-leaf" : "bg-flame shadow-[0_14px_30px_-10px_rgba(214,35,42,0.6)]"
            )}
          >
            {added ? (
              <span className="anim-pop mx-auto flex items-center gap-2">
                <IconCheck className="h-5 w-5" /> Added
              </span>
            ) : (
              <>
                <span>Add to Cart</span>
                <span className="text-[15px] font-extrabold">{naira(total)}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
