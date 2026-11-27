import { useState } from "react";
import {
  IconArrowLeft,
  IconBag,
  IconBike,
  IconCash,
  IconCheck,
  IconCopy,
  IconPhonePay,
} from "../components/Icons";
import { DELIVERY_FEE, SPOTS } from "../data/menu";
import { useApp } from "../lib/appState";
import type { Order } from "../lib/store";
import { naira } from "../lib/store";
import { cn } from "../utils/cn";

type Props = {
  onBack: () => void;
  onPlaced: (order: Order) => void;
};

const ACCOUNT = { bank: "Palmpay", number: "812 345 6789", name: "Hot Meals Ltd" };

export function Checkout({ onBack, onPlaced }: Props) {
  const { cart, subtotal, cartCount, coupons, appliedCouponId, placeOrder } = useApp();
  const [spot, setSpot] = useState("Permanent Site");
  const [note, setNote] = useState("");
  const [method, setMethod] = useState<"delivery" | "pickup">("delivery");
  const [payment, setPayment] = useState<"cash" | "app">("cash");
  const [paid, setPaid] = useState(false);
  const [copied, setCopied] = useState(false);

  const applied = coupons.find((c) => c.id === appliedCouponId && c.status === "live" && subtotal >= c.minOrder);
  const fee = method === "delivery" ? DELIVERY_FEE : 0;
  const discount = applied ? applied.discount : 0;
  const total = Math.max(0, subtotal + fee - discount);

  const spotOk = spot !== "Other" || note.trim().length > 0;
  const payOk = payment === "cash" || paid;
  const canPlace = spotOk && payOk && cart.length > 0;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(ACCOUNT.number.replace(/\s/g, ""));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  const place = () => {
    if (!canPlace) return;
    const order = placeOrder({
      spot,
      spotNote: spot === "Other" ? note.trim() : undefined,
      method,
      payment,
    });
    if (order) onPlaced(order);
  };

  return (
    <div className="relative h-full bg-cream">
      <div className="no-scrollbar absolute inset-0 overflow-y-auto pb-44">
        <header className="flex items-center gap-3 px-5 pt-14">
          <button
            onClick={onBack}
            className="press flex h-11 w-11 items-center justify-center rounded-full bg-white text-cocoa shadow-sm"
            aria-label="Back"
          >
            <IconArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="font-display text-2xl font-extrabold text-cocoa">Checkout</h1>
        </header>

        <div className="mt-5 space-y-4 px-5">
          <section className="rounded-[1.4rem] bg-white p-4 shadow-sm">
            <h2 className="font-display text-lg font-extrabold text-cocoa">Where are you?</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {SPOTS.map((s) => (
                <button
                  key={s}
                  onClick={() => setSpot(s)}
                  className={cn(
                    "press rounded-full px-4 py-2.5 text-[13px] font-bold",
                    spot === s ? "bg-cocoa text-cream" : "bg-cream text-cocoa/80"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
            {spot === "Other" && (
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Behind TTF hostel, block C"
                className="anim-fade mt-3 w-full rounded-2xl bg-cream px-4 py-3.5 text-sm font-medium text-cocoa outline-none ring-2 ring-transparent transition placeholder:text-cocoa/35 focus:ring-mustard"
              />
            )}
          </section>

          <section className="rounded-[1.4rem] bg-white p-4 shadow-sm">
            <h2 className="font-display text-lg font-extrabold text-cocoa">Delivery method</h2>
            <div className="mt-3 space-y-2.5">
              <button
                onClick={() => setMethod("delivery")}
                className={cn(
                  "press flex w-full items-center gap-3 rounded-2xl border-2 p-3.5 text-left",
                  method === "delivery" ? "border-cocoa bg-cocoa text-cream" : "border-transparent bg-cream text-cocoa"
                )}
              >
                <span
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                    method === "delivery" ? "bg-mustard text-cocoa" : "bg-mustard/25 text-cocoa"
                  )}
                >
                  <IconBike className="h-5 w-5" />
                </span>
                <span className="flex-1">
                  <span className="block text-[14.5px] font-bold">Deliver to my spot</span>
                  <span className={cn("text-xs font-semibold", method === "delivery" ? "text-cream/60" : "text-cocoa/50")}>
                    {naira(DELIVERY_FEE)}, about 20 minutes
                  </span>
                </span>
              </button>
              <button
                onClick={() => setMethod("pickup")}
                className={cn(
                  "press flex w-full items-center gap-3 rounded-2xl border-2 p-3.5 text-left",
                  method === "pickup" ? "border-cocoa bg-cocoa text-cream" : "border-transparent bg-cream text-cocoa"
                )}
              >
                <span
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                    method === "pickup" ? "bg-mustard text-cocoa" : "bg-mustard/25 text-cocoa"
                  )}
                >
                  <IconBag className="h-5 w-5" />
                </span>
                <span className="flex-1">
                  <span className="block text-[14.5px] font-bold">I will pick up</span>
                  <span className={cn("text-xs font-semibold", method === "pickup" ? "text-cream/60" : "text-cocoa/50")}>
                    Free, ready in about 15 minutes
                  </span>
                </span>
              </button>
            </div>
          </section>

          <section className="rounded-[1.4rem] bg-white p-4 shadow-sm">
            <h2 className="font-display text-lg font-extrabold text-cocoa">Payment</h2>
            <div className="mt-3 space-y-2.5">
              <button
                onClick={() => setPayment("cash")}
                className={cn(
                  "press flex w-full items-center gap-3 rounded-2xl border-2 p-3.5 text-left",
                  payment === "cash" ? "border-cocoa bg-cocoa text-cream" : "border-transparent bg-cream text-cocoa"
                )}
              >
                <span
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                    payment === "cash" ? "bg-mustard text-cocoa" : "bg-mustard/25 text-cocoa"
                  )}
                >
                  <IconCash className="h-5 w-5" />
                </span>
                <span className="flex-1">
                  <span className="block text-[14.5px] font-bold">Pay on delivery</span>
                  <span className={cn("text-xs font-semibold", payment === "cash" ? "text-cream/60" : "text-cocoa/50")}>
                    Cash or transfer to the rider
                  </span>
                </span>
              </button>
              <button
                onClick={() => setPayment("app")}
                className={cn(
                  "press flex w-full items-center gap-3 rounded-2xl border-2 p-3.5 text-left",
                  payment === "app" ? "border-cocoa bg-cocoa text-cream" : "border-transparent bg-cream text-cocoa"
                )}
              >
                <span
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                    payment === "app" ? "bg-mustard text-cocoa" : "bg-mustard/25 text-cocoa"
                  )}
                >
                  <IconPhonePay className="h-5 w-5" />
                </span>
                <span className="flex-1">
                  <span className="block text-[14.5px] font-bold">Pay in app</span>
                  <span className={cn("text-xs font-semibold", payment === "app" ? "text-cream/60" : "text-cocoa/50")}>
                    Transfer before we dispatch
                  </span>
                </span>
              </button>
            </div>

            {payment === "app" && (
              <div className="anim-fade mt-3 rounded-2xl bg-cocoa p-4 text-cream">
                <p className="text-xs font-bold text-cream/55">Send {naira(total)} to</p>
                <div className="mt-2.5 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-semibold text-cream/60">Bank</span>
                    <span className="font-bold">{ACCOUNT.bank}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-cream/60">Account number</span>
                    <span className="flex items-center gap-2">
                      <span className="select-text font-display text-lg font-extrabold tracking-wide text-mustard">
                        {ACCOUNT.number}
                      </span>
                      <button
                        onClick={copy}
                        className="press flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1.5 text-[11px] font-bold text-cream"
                      >
                        {copied ? <IconCheck className="h-3.5 w-3.5 text-leaf" /> : <IconCopy className="h-3.5 w-3.5" />}
                        {copied ? "Copied" : "Copy"}
                      </button>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-cream/60">Account name</span>
                    <span className="font-bold">{ACCOUNT.name}</span>
                  </div>
                </div>
                {paid ? (
                  <div className="anim-pop mt-3.5 flex w-full items-center justify-center gap-2 rounded-full bg-leaf py-3 text-[13.5px] font-extrabold text-white">
                    <IconCheck className="h-4 w-4" /> Payment noted, we verify on dispatch
                  </div>
                ) : (
                  <button
                    onClick={() => setPaid(true)}
                    className="press mt-3.5 w-full rounded-full bg-mustard py-3 font-display text-[14px] font-bold text-cocoa"
                  >
                    I have paid
                  </button>
                )}
              </div>
            )}
          </section>

          <section className="space-y-2.5 rounded-[1.4rem] bg-white p-4 shadow-sm">
            <div className="flex justify-between text-sm font-semibold text-cocoa/70">
              <span>Items</span>
              <span className="text-cocoa">{cartCount}</span>
            </div>
            <div className="flex justify-between text-sm font-semibold text-cocoa/70">
              <span>Subtotal</span>
              <span className="text-cocoa">{naira(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm font-semibold text-cocoa/70">
              <span>Delivery fee</span>
              {fee === 0 ? (
                <span className="font-extrabold text-leaf">Free</span>
              ) : (
                <span className="text-cocoa">{naira(fee)}</span>
              )}
            </div>
            {applied && (
              <div className="flex justify-between text-sm font-extrabold text-leaf">
                <span>Coupon, {applied.title}</span>
                <span>-{naira(discount)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-cocoa/10 pt-2.5 font-display text-lg font-extrabold text-cocoa">
              <span>Total</span>
              <span>{naira(total)}</span>
            </div>
          </section>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-cream via-cream/95 to-transparent px-5 pt-10 pb-[max(1.4rem,env(safe-area-inset-bottom))]">
        <button
          onClick={place}
          disabled={!canPlace}
          className="press w-full rounded-full bg-flame py-4 font-display text-[16px] font-bold text-white shadow-[0_16px_34px_-12px_rgba(214,35,42,0.7)] disabled:opacity-40 disabled:shadow-none"
        >
          {spotOk ? `Place order · ${naira(total)}` : "Tell us where you are"}
        </button>
      </div>
    </div>
  );
}
