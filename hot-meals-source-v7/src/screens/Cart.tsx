import { useState } from "react";
import { IconArrowLeft, IconBasket, IconCheck, IconChevronRight, IconMinus, IconPlus, IconTicket, LogoPot } from "../components/Icons";
import { Photo } from "../components/Photo";
import { DELIVERY_FEE } from "../data/menu";
import { useApp } from "../lib/appState";
import { naira } from "../lib/store";
import { cn } from "../utils/cn";

export function Cart({ onBack, onCheckout }: { onBack: () => void; onCheckout: () => void }) {
  const { cart, setQty, subtotal, cartCount, coupons, appliedCouponId, setAppliedCouponId } = useApp();
  const [sheetOpen, setSheetOpen] = useState(false);

  const applied = coupons.find((c) => c.id === appliedCouponId) ?? null;
  const appliedUsable = !!applied && applied.status === "live" && subtotal >= applied.minOrder;
  const discount = appliedUsable ? applied!.discount : 0;
  const total = subtotal + DELIVERY_FEE - discount;

  if (cart.length === 0) {
    return (
      <div className="relative flex h-full flex-col bg-cream">
        <header className="flex items-center gap-3 px-5 pt-14">
          <button
            onClick={onBack}
            className="press flex h-11 w-11 items-center justify-center rounded-full bg-white text-cocoa shadow-sm"
            aria-label="Back"
          >
            <IconArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="font-display text-2xl font-extrabold text-cocoa">Your cart</h1>
        </header>
        <div className="flex flex-1 flex-col items-center justify-center px-8 pb-24 text-center">
          <LogoPot className="h-20 w-20 text-cocoa/15" />
          <p className="mt-5 font-display text-xl font-extrabold text-cocoa">Your cart is empty</p>
          <p className="mt-1 text-sm text-cocoa/55">Hot jollof and cold drinks are two taps away.</p>
          <button
            onClick={onBack}
            className="press mt-6 flex items-center gap-2 rounded-full bg-flame px-6 py-3 font-display text-[15px] font-bold text-white shadow-[0_14px_28px_-10px_rgba(214,35,42,0.65)]"
          >
            <IconBasket className="h-5 w-5" /> Browse food
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full bg-cream">
      <div className="no-scrollbar absolute inset-0 overflow-y-auto pb-40">
        <header className="flex items-center gap-3 px-5 pt-14">
          <button
            onClick={onBack}
            className="press flex h-11 w-11 items-center justify-center rounded-full bg-white text-cocoa shadow-sm"
            aria-label="Back"
          >
            <IconArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="font-display text-2xl font-extrabold text-cocoa">Your cart</h1>
          <span className="ml-auto rounded-full bg-cocoa px-3 py-1 text-xs font-extrabold text-cream">
            {cartCount} {cartCount === 1 ? "item" : "items"}
          </span>
        </header>

        <div className="mt-5 space-y-3 px-5">
          {cart.map((l, i) => (
            <div
              key={l.key}
              className="anim-fade-up flex gap-3 rounded-[1.4rem] bg-white p-3 shadow-sm"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <span className="h-[74px] w-[74px] shrink-0 overflow-hidden rounded-xl">
                <Photo name={l.photo} alt={l.name} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-bold text-cocoa">{l.name}</p>
                {(l.extras.length > 0 || l.picks.length > 0) && (
                  <p className="mt-0.5 truncate text-xs text-cocoa/50">
                    {[...l.picks, ...l.extras.map((e) => e.name)].join(", ")}
                  </p>
                )}
                <div className="mt-2.5 flex items-center justify-between">
                  <span className="text-[15px] font-extrabold text-flame">{naira(l.unitPrice * l.qty)}</span>
                  <div className="flex items-center gap-2.5 rounded-full bg-cream p-1">
                    <button
                      onClick={() => setQty(l.key, l.qty - 1)}
                      className="press flex h-7 w-7 items-center justify-center rounded-full bg-white text-cocoa"
                      aria-label="Less"
                    >
                      <IconMinus className="h-3.5 w-3.5" />
                    </button>
                    <span key={l.qty} className="anim-pop w-5 text-center text-sm font-extrabold text-cocoa">
                      {l.qty}
                    </span>
                    <button
                      onClick={() => setQty(l.key, l.qty + 1)}
                      className="press flex h-7 w-7 items-center justify-center rounded-full bg-cocoa text-cream"
                      aria-label="More"
                    >
                      <IconPlus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 px-5">
          <button
            onClick={() => setSheetOpen(true)}
            className="press flex w-full items-center gap-3 rounded-[1.4rem] bg-white p-4 text-left shadow-sm"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-mustard/25">
              <IconTicket className="h-5 w-5 text-cocoa" />
            </span>
            <span className="flex-1">
              <span className="block text-[14.5px] font-bold text-cocoa">Coupon</span>
              {applied && appliedUsable ? (
                <span className="text-xs font-bold text-leaf">{applied.title} applied</span>
              ) : applied ? (
                <span className="text-xs font-bold text-rust">{applied.title} needs {naira(applied.minOrder)} minimum</span>
              ) : (
                <span className="text-xs font-semibold text-cocoa/50">
                  {coupons.filter((c) => c.status === "live").length} available
                </span>
              )}
            </span>
            <IconChevronRight className="h-4 w-4 text-cocoa/40" />
          </button>

          <div className="mt-3.5 space-y-2.5 rounded-[1.4rem] bg-white p-4 shadow-sm">
            <div className="flex justify-between text-sm font-semibold text-cocoa/70">
              <span>Subtotal</span>
              <span className="text-cocoa">{naira(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm font-semibold text-cocoa/70">
              <span>
                Delivery fee
                <span className="ml-1.5 text-[11px] font-medium text-cocoa/45">waived on pickup</span>
              </span>
              <span className="text-cocoa">{naira(DELIVERY_FEE)}</span>
            </div>
            {appliedUsable && (
              <div className="flex justify-between text-sm font-extrabold text-leaf">
                <span>Coupon, {applied!.title}</span>
                <span>-{naira(discount)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-cocoa/10 pt-2.5 font-display text-lg font-extrabold text-cocoa">
              <span>Total</span>
              <span>{naira(total)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-cream via-cream/95 to-transparent px-5 pt-10 pb-[max(1.4rem,env(safe-area-inset-bottom))]">
        <button
          onClick={onCheckout}
          className="press w-full rounded-full bg-flame py-4 font-display text-[16px] font-bold text-white shadow-[0_16px_34px_-12px_rgba(214,35,42,0.7)]"
        >
          Checkout · {naira(total)}
        </button>
      </div>

      {sheetOpen && (
        <div className="absolute inset-0 z-40">
          <div className="anim-fade absolute inset-0 bg-cocoa/45" onClick={() => setSheetOpen(false)} />
          <div className="anim-sheet absolute inset-x-0 bottom-0 max-h-[78%] overflow-y-auto rounded-t-[2rem] bg-cream p-5 pb-[max(1.6rem,env(safe-area-inset-bottom))]">
            <div className="mx-auto h-1.5 w-10 rounded-full bg-cocoa/15" />
            <h3 className="mt-4 font-display text-lg font-extrabold text-cocoa">Choose a coupon</h3>
            <div className="mt-3 space-y-2.5">
              {applied && (
                <button
                  onClick={() => {
                    setAppliedCouponId(null);
                    setSheetOpen(false);
                  }}
                  className="press flex w-full items-center justify-center rounded-2xl border-2 border-dashed border-cocoa/25 py-3.5 text-[13.5px] font-bold text-cocoa/60"
                >
                  Remove coupon
                </button>
              )}
              {coupons.map((c) => {
                const live = c.status === "live";
                const usable = live && subtotal >= c.minOrder;
                const reason = !live
                  ? c.status === "used"
                    ? "Used already"
                    : "Expired"
                  : subtotal < c.minOrder
                    ? `Add ${naira(c.minOrder - subtotal)} more to use`
                    : null;
                const isApplied = appliedCouponId === c.id;
                return (
                  <button
                    key={c.id}
                    disabled={!usable}
                    onClick={() => {
                      setAppliedCouponId(c.id);
                      setSheetOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-2xl bg-white p-3.5 text-left ring-2 transition",
                      usable ? "press" : "opacity-55",
                      isApplied ? "ring-mustard" : "ring-transparent"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-12 w-14 shrink-0 flex-col items-center justify-center rounded-xl",
                        live ? "bg-mustard" : "bg-cocoa/15"
                      )}
                    >
                      <span className="font-display text-[13px] font-extrabold text-cocoa">{naira(c.discount)}</span>
                      <span className="text-[9px] font-extrabold text-cocoa/65">off</span>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[14px] font-bold text-cocoa">{c.title}</span>
                      <span className="block truncate text-xs text-cocoa/50">{c.detail}</span>
                      {reason && <span className="block text-[11px] font-bold text-rust">{reason}</span>}
                    </span>
                    <span
                      className={cn(
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                        isApplied ? "anim-pop bg-cocoa text-cream" : "border-2 border-cocoa/15"
                      )}
                    >
                      {isApplied && <IconCheck className="h-3.5 w-3.5" />}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
