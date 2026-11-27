import { useEffect, useState } from "react";
import { IconBike, IconCheck, IconFlame, IconReceipt } from "../components/Icons";
import { LogoPot } from "../components/Icons";
import { useApp } from "../lib/appState";
import type { Order } from "../lib/store";
import { firstName, naira } from "../lib/store";
import { cn } from "../utils/cn";

type Props = {
  order: Order;
  onHome: () => void;
  onOrders: () => void;
};

export function Confirmed({ order, onHome, onOrders }: Props) {
  const { user, orders } = useApp();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step >= 3) return;
    const t = window.setTimeout(() => setStep((s) => Math.min(3, s + 1)), 3400);
    return () => window.clearTimeout(t);
  }, [step]);

  const steps = [
    { label: "Received", icon: IconReceipt },
    { label: "Preparing", icon: IconFlame },
    { label: "On the way", icon: IconBike },
    { label: "Delivered", icon: IconCheck },
  ];
  const messages =
    order.method === "delivery"
      ? [
          "We got your order",
          "The kitchen is on it",
          `Rider is heading to ${order.spot}`,
          "Delivered. Enjoy your meal",
        ]
      : ["We got your order", "The kitchen is on it", "Your food is being packed", "Ready, come pick it up"];

  const stampEarned = orders.length > 0 && orders.length % 5 === 0;
  const last4 = user ? user.phone.slice(-4) : "0000";

  return (
    <div className="relative h-full bg-cream">
      <div className="no-scrollbar absolute inset-0 overflow-y-auto">
        <div className="flex flex-col items-center px-5 pt-16 pb-[max(2rem,env(safe-area-inset-bottom))]">
          <div className="anim-pop flex h-24 w-24 items-center justify-center rounded-full bg-[#E4F3E7]">
            <svg viewBox="0 0 100 100" className="h-14 w-14" fill="none" aria-hidden="true">
              <circle cx="50" cy="50" r="46" stroke="#1E9E4A" strokeWidth="6" strokeLinecap="round" className="draw-circle" />
              <path d="M30 52l13 13 27-30" stroke="#1E9E4A" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" className="draw-check" />
            </svg>
          </div>

          <h1 className="mt-5 font-display text-[28px] font-extrabold text-cocoa">Order placed</h1>
          <span className="mt-2.5 rounded-full bg-cocoa px-4 py-2 font-display text-[15px] font-extrabold text-mustard">
            Order {order.code}
          </span>
          <p className="mt-3 max-w-[34ch] text-center text-[13px] leading-relaxed text-cocoa/60">
            We confirm you by name and the last 4 digits of your phone.
          </p>
          <p className="mt-1 text-[13px] font-bold text-cocoa">
            {user ? firstName(user.name) : "You"} · •••• {last4}
          </p>

          <section className="mt-5 w-full rounded-[1.6rem] bg-white p-5 shadow-sm">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-extrabold text-cocoa/50">Live status</span>
              <span key={step} className="anim-fade text-[12px] font-bold text-leaf">
                {messages[step]}
              </span>
            </div>

            <div className="relative mt-5">
              <div className="absolute left-5 right-5 top-5 h-[3px] rounded-full bg-cocoa/10" />
              <div
                className="absolute left-5 top-5 h-[3px] rounded-full bg-leaf transition-all duration-700 ease-out"
                style={{ width: `calc((100% - 40px) * ${step / 3})` }}
              />
              <div className="relative grid grid-cols-4">
                {steps.map((s, i) => {
                  const Icon = s.icon;
                  const done = i < step;
                  const current = i === step;
                  return (
                    <div key={s.label} className="flex flex-col items-center">
                      <span
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-full",
                          done && "bg-cocoa text-cream",
                          current && "pulse-ring bg-mustard text-cocoa",
                          !done && !current && "border-2 border-cocoa/15 bg-cream text-cocoa/35"
                        )}
                      >
                        {done ? <IconCheck className="h-4 w-4" /> : <Icon className="h-4.5 w-4.5" />}
                      </span>
                      <span
                        className={cn(
                          "mt-2 text-center text-[10.5px] font-bold",
                          current ? "text-cocoa" : "text-cocoa/50"
                        )}
                      >
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {stampEarned && (
            <div className="anim-fade-up mt-4 flex w-full items-center gap-3 rounded-2xl bg-mustard p-4">
              <LogoPot className="h-9 w-9 shrink-0 text-cocoa" />
              <p className="text-[13px] font-bold leading-snug text-cocoa">
                Stamp earned. 500 naira off just landed in your rewards.
              </p>
            </div>
          )}

          <section className="mt-4 w-full rounded-[1.6rem] bg-white p-5 shadow-sm">
            <h3 className="font-display text-lg font-extrabold text-cocoa">Receipt</h3>
            <div className="mt-3 space-y-2">
              {order.items.map((it, i) => (
                <div key={i} className="flex items-baseline justify-between gap-3">
                  <div>
                    <span className="text-[13.5px] font-semibold text-cocoa/85">
                      {it.qty} × {it.name}
                    </span>
                    {(it.extras.length > 0 || it.picks.length > 0) && (
                      <p className="text-[11.5px] text-cocoa/45">{[...it.picks, ...it.extras].join(", ")}</p>
                    )}
                  </div>
                  <span className="text-[13px] font-bold text-cocoa">{naira(it.unitPrice * it.qty)}</span>
                </div>
              ))}
            </div>

            <div className="my-3.5 border-t border-dashed border-cocoa/20" />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-semibold text-cocoa/55">Spot</span>
                <span className="font-bold text-cocoa">
                  {order.spot}
                  {order.spotNote ? `, ${order.spotNote}` : ""}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-cocoa/55">Delivery</span>
                <span className="font-bold text-cocoa">
                  {order.method === "delivery" ? "To your spot" : "Pick up at the kitchen"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-cocoa/55">Payment</span>
                {order.payment === "app" ? (
                  <span className="flex items-center gap-1 font-extrabold text-leaf">
                    <IconCheck className="h-4 w-4" /> Paid in app
                  </span>
                ) : (
                  <span className="font-bold text-cocoa">Pay on delivery</span>
                )}
              </div>
            </div>

            <div className="my-3.5 border-t border-dashed border-cocoa/20" />

            <div className="space-y-2 text-sm font-semibold text-cocoa/70">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-cocoa">{naira(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery fee</span>
                {order.fee === 0 ? (
                  <span className="font-extrabold text-leaf">Free</span>
                ) : (
                  <span className="text-cocoa">{naira(order.fee)}</span>
                )}
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between font-extrabold text-leaf">
                  <span>Coupon</span>
                  <span>-{naira(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-cocoa/10 pt-2.5 font-display text-[16px] font-extrabold text-cocoa">
                <span>Total</span>
                <span>{naira(order.total)}</span>
              </div>
            </div>
          </section>

          <div className="mt-5 flex w-full gap-3">
            <button
              onClick={onHome}
              className="press flex-1 rounded-full bg-flame py-4 font-display text-[15px] font-bold text-white shadow-[0_14px_30px_-10px_rgba(214,35,42,0.65)]"
            >
              Back to home
            </button>
            <button
              onClick={onOrders}
              className="press flex-1 rounded-full border-2 border-cocoa/15 bg-white py-4 font-display text-[15px] font-bold text-cocoa"
            >
              My orders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
