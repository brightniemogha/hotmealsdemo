import { useRef, useState } from "react";
import { IconBasket, IconCheck, IconChevronDown, IconClose, IconPin, IconPlus, IconSearch, LogoPot } from "../components/Icons";
import { Photo } from "../components/Photo";
import { CAMPUSES, CATEGORIES, MENU } from "../data/menu";
import type { MenuItem } from "../data/menu";
import { useApp } from "../lib/appState";
import { naira } from "../lib/store";
import { cn } from "../utils/cn";

type Props = {
  onOpenFood: (id: string) => void;
  onOpenCart: () => void;
  onOpenOwner: () => void;
};

export function HomeTab({ onOpenFood, onOpenCart, onOpenOwner }: Props) {
  const { user, orders, reorder, addToCart, showToast, spot, setSpot, cartCount } = useApp();
  const [q, setQ] = useState("");
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [campusOpen, setCampusOpen] = useState(false);
  const taps = useRef<number[]>([]);

  const onLogoTap = () => {
    const now = Date.now();
    const recent = [...taps.current.filter((t) => now - t < 2500), now];
    taps.current = recent;
    if (recent.length >= 5) {
      taps.current = [];
      onOpenOwner();
    }
  };

  const quickAdd = (item: MenuItem) => {
    navigator.vibrate?.(12);
    const picks = (item.picks ?? []).map((g) => g.options[0]);
    addToCart({
      key: `${item.id}||${picks.join(",")}`,
      itemId: item.id,
      name: item.name,
      photo: item.photo,
      unitPrice: item.price,
      qty: 1,
      extras: [],
      picks,
    });
    showToast({ title: "Added to cart", sub: item.name, actionLabel: "View Cart", onAction: onOpenCart });
  };

  const addAgain = () => {
    const last = orders[0];
    if (!last) return;
    reorder(last);
    showToast({
      title: "Added to cart",
      sub: `Your ${last.code} order, again`,
      actionLabel: "View Cart",
      onAction: onOpenCart,
    });
  };

  const query = q.trim().toLowerCase();
  const results = query ? MENU.filter((m) => m.name.toLowerCase().includes(query)) : [];
  const sections = CATEGORIES.filter((c) => !activeCat || c.name === activeCat);
  const lastOrder = orders[0];

  return (
    <div className="relative h-full bg-cream">
      <div className="no-scrollbar h-full overflow-y-auto pb-48">
        <header className="hero-red rounded-b-[2rem] px-5 pb-6 pt-14 shadow-[0_18px_40px_-22px_rgba(181,18,27,0.9)]">
          <div className="flex items-center justify-between">
            <button
              onClick={onLogoTap}
              className="press flex h-11 w-11 items-center justify-center rounded-[1rem] bg-white shadow-sm"
              aria-label="Hot Meals"
            >
              <LogoPot className="h-7 w-7 text-flame" />
            </button>
            <button
              onClick={onOpenCart}
              className="press relative flex h-11 w-11 items-center justify-center rounded-full bg-mustard text-cocoa shadow-lg"
              aria-label="Cart"
            >
              <IconBasket className="h-5 w-5" />
              {cartCount > 0 && (
                <span
                  key={cartCount}
                  className="anim-pop absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-cocoa px-1 text-[11px] font-extrabold text-white"
                >
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          <h1 className="mt-4 font-display text-[28px] font-extrabold tracking-tight text-white">
            Hi, {user ? user.name.trim().split(/\s+/)[0] : "there"}
          </h1>
          <p className="text-[14px] font-semibold text-white/85">What are you eating today?</p>

          <button
            onClick={() => setCampusOpen(true)}
            className="press mt-3.5 inline-flex items-center gap-1.5 rounded-full bg-white py-2 pl-3 pr-2.5 shadow-sm"
          >
            <IconPin className="h-4 w-4 text-cocoa" />
            <span className="text-[13px] font-bold text-cocoa">UniJos {spot}</span>
            <IconChevronDown className="h-4 w-4 text-cocoa/45" />
          </button>

          <div className="relative mt-4">
            <IconSearch className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-cocoa/40" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search jollof, coke, amala"
              className="w-full rounded-full bg-white py-3.5 pl-11 pr-11 text-[14.5px] font-medium text-cocoa shadow-sm outline-none ring-2 ring-transparent transition placeholder:text-cocoa/35 focus:ring-mustard"
            />
            {q !== "" && (
              <button
                onClick={() => setQ("")}
                className="press absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-cocoa/10 p-1.5 text-cocoa/70"
                aria-label="Clear search"
              >
                <IconClose className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </header>

        {query ? (
          <section className="px-5 pt-5">
            {results.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {results.map((m, i) => (
                  <div
                    key={m.id}
                    onClick={() => onOpenFood(m.id)}
                    className="anim-fade-up cursor-pointer overflow-hidden rounded-[1.3rem] bg-white shadow-sm press"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <div className="h-28 overflow-hidden">
                      <Photo name={m.photo} alt={m.name} />
                    </div>
                    <div className="p-3">
                      <p className="text-[14px] font-bold text-cocoa">{m.name}</p>
                      <div className="mt-1.5 flex items-center justify-between">
                        <span className="text-[13.5px] font-extrabold text-flame">{naira(m.price)}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            quickAdd(m);
                          }}
                          className="press flex h-8 w-8 items-center justify-center rounded-full bg-cocoa text-cream"
                          aria-label={`Add ${m.name}`}
                        >
                          <IconPlus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center py-20 text-center">
                <LogoPot className="h-16 w-16 text-cocoa/15" />
                <p className="mt-4 font-display text-lg font-extrabold text-cocoa">Nothing matches “{q.trim()}”</p>
                <p className="mt-1 text-sm text-cocoa/55">Try jollof, amala or coke</p>
                <button
                  onClick={() => setQ("")}
                  className="press mt-5 rounded-full bg-cocoa px-5 py-2.5 text-[13px] font-bold text-cream"
                >
                  Clear search
                </button>
              </div>
            )}
          </section>
        ) : (
          <>
            {lastOrder && (
              <section className="px-5 pt-5">
                <div className="anim-fade-up relative overflow-hidden rounded-[1.6rem] bg-mustard p-4">
                  <LogoPot className="absolute -bottom-7 -right-4 h-32 w-32 rotate-[-14deg] text-cocoa/10" />
                  <p className="font-display text-lg font-extrabold text-cocoa">Order again</p>
                  <p className="mt-0.5 max-w-[85%] truncate text-[12.5px] font-semibold text-cocoa/65">
                    {lastOrder.code} · {lastOrder.items.map((i) => i.name).join(", ")}
                  </p>
                  <div className="mt-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-2.5">
                        {lastOrder.items.slice(0, 3).map((i) => (
                          <div key={i.itemId + i.name} className="h-9 w-9 overflow-hidden rounded-full ring-2 ring-mustard">
                            <Photo name={i.photo} alt={i.name} />
                          </div>
                        ))}
                      </div>
                      <span className="font-display text-[15px] font-extrabold text-cocoa">{naira(lastOrder.total)}</span>
                    </div>
                    <button
                      onClick={addAgain}
                      className="press rounded-full bg-flame px-4 py-2.5 text-[13px] font-extrabold text-white shadow-[0_10px_22px_-8px_rgba(214,35,42,0.7)]"
                    >
                      Add all
                    </button>
                  </div>
                </div>
              </section>
            )}

            <div className="no-scrollbar mt-6 flex gap-2.5 overflow-x-auto px-5">
              {CATEGORIES.map((c) => {
                const active = activeCat === c.name;
                return (
                  <button
                    key={c.name}
                    onClick={() => setActiveCat(active ? null : c.name)}
                    className={cn(
                      "press flex shrink-0 items-center gap-2 rounded-full py-1.5 pl-1.5 pr-4",
                      active ? "bg-cocoa text-cream" : "bg-white text-cocoa shadow-sm"
                    )}
                  >
                    <span
                      className={cn(
                        "h-9 w-9 overflow-hidden rounded-full ring-2",
                        active ? "ring-mustard" : "ring-cream"
                      )}
                    >
                      <Photo name={c.items[0].photo} alt={c.name} />
                    </span>
                    <span className="text-[13px] font-bold">{c.name}</span>
                  </button>
                );
              })}
            </div>

            {sections.map((sec) => (
              <section key={sec.name} className="mt-7">
                <div className="flex items-baseline justify-between px-5">
                  <h3 className="font-display text-xl font-extrabold text-cocoa">{sec.name}</h3>
                  <span className="text-xs font-bold text-cocoa/45">
                    {sec.items.length} {sec.items.length === 1 ? "dish" : "dishes"}
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3 px-5">
                  {sec.items.map((m, i) => (
                    <div
                      key={m.id}
                      onClick={() => onOpenFood(m.id)}
                      className="anim-fade-up press cursor-pointer overflow-hidden rounded-[1.4rem] bg-white shadow-[0_12px_28px_-18px_rgba(42,23,16,0.55)]"
                      style={{ animationDelay: `${i * 70}ms` }}
                    >
                      <div className="aspect-[4/3] overflow-hidden">
                        <Photo name={m.photo} alt={m.name} />
                      </div>
                      <div className="p-3">
                        <h4 className="font-display text-[15px] font-bold leading-tight text-cocoa">{m.name}</h4>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-[14px] font-extrabold text-flame">{naira(m.price)}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              quickAdd(m);
                            }}
                            className="press nav-active flex h-9 w-9 items-center justify-center rounded-full text-cocoa"
                            aria-label={`Add ${m.name}`}
                          >
                            <IconPlus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </>
        )}
      </div>

      {campusOpen && (
        <div className="absolute inset-0 z-40">
          <div className="anim-fade absolute inset-0 bg-cocoa/45" onClick={() => setCampusOpen(false)} />
          <div className="anim-sheet absolute inset-x-0 bottom-0 rounded-t-[2rem] bg-white p-5 pb-[max(1.6rem,env(safe-area-inset-bottom))]">
            <div className="mx-auto h-1.5 w-10 rounded-full bg-cocoa/15" />
            <h3 className="mt-4 font-display text-lg font-extrabold text-cocoa">Your campus spot</h3>
            {CAMPUSES.map((c) => {
              const active = spot === c;
              return (
                <button
                  key={c}
                  onClick={() => {
                    setSpot(c);
                    setCampusOpen(false);
                  }}
                  className={cn(
                    "press mt-2.5 flex w-full items-center gap-3 rounded-2xl p-3.5 text-left",
                    active ? "bg-cream" : "bg-white"
                  )}
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-mustard/25">
                    <IconPin className="h-5 w-5 text-cocoa" />
                  </span>
                  <span className="flex-1 text-[14.5px] font-bold text-cocoa">UniJos {c}</span>
                  {active ? (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cocoa text-cream">
                      <IconCheck className="h-3.5 w-3.5" />
                    </span>
                  ) : (
                    <span className="h-6 w-6 rounded-full border-2 border-cocoa/15" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
