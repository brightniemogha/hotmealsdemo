import { IconPotStamp } from "../components/Icons";
import { useApp } from "../lib/appState";
import { naira, shortDate } from "../lib/store";
import { cn } from "../utils/cn";

export function RewardsTab() {
  const { orders, coupons } = useApp();
  const unlocked = orders.length > 0 && orders.length % 5 === 0;
  const filled = unlocked ? 5 : orders.length % 5;

  return (
    <div className="no-scrollbar h-full overflow-y-auto bg-cream pb-36">
      <header className="px-5 pt-14">
        <h1 className="font-display text-[26px] font-extrabold tracking-tight text-cocoa">Rewards</h1>
        <p className="mt-0.5 text-sm font-medium text-cocoa/55">Stamps and coupons for regulars</p>
      </header>

      <section className="mx-5 mt-5 relative overflow-hidden rounded-[1.8rem] bg-mustard p-5">
        <div className="absolute -right-8 -top-12 h-40 w-40 rounded-full bg-white/15" />
        <div className="absolute -bottom-14 -left-8 h-32 w-32 rounded-full bg-cocoa/5" />
        <div className="relative flex items-start justify-between gap-3">
          <div>
            <p className="text-[12px] font-extrabold text-cocoa/65">Stamp card</p>
            <h2 className="mt-0.5 font-display text-[22px] font-extrabold leading-tight text-cocoa">
              {unlocked ? "Reward unlocked" : "Eat well, earn stamps"}
            </h2>
          </div>
          <span className="rounded-full bg-cocoa px-3 py-1.5 text-[11.5px] font-extrabold text-mustard">
            {filled} of 5
          </span>
        </div>

        <div className="relative mt-5 flex justify-between">
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} style={{ transform: i % 2 === 0 ? "rotate(-4deg)" : "rotate(5deg)" }}>
              <span
                style={{ animationDelay: `${i * 90}ms` }}
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-full",
                  i < filled ? "anim-pop bg-cocoa text-mustard" : "border-2 border-dashed border-cocoa/35 text-cocoa/30"
                )}
              >
                <IconPotStamp className="h-6 w-6" />
              </span>
            </span>
          ))}
        </div>

        <p className="relative mt-4 text-[13.5px] font-bold text-cocoa">
          {unlocked
            ? "500 naira off added to your coupons. Nice one."
            : "Your 5th order comes with 500 naira off."}
        </p>
        <p className="relative mt-0.5 text-xs text-cocoa/70">Every order earns one stamp. It is automatic, no stress.</p>
      </section>

      <section className="mt-7 px-5">
        <div className="flex items-baseline justify-between">
          <h3 className="font-display text-lg font-extrabold text-cocoa">Coupons</h3>
          <span className="text-xs font-bold text-cocoa/50">Apply them in your cart</span>
        </div>

        <div className="mt-3 space-y-3">
          {coupons.map((c, i) => {
            const live = c.status === "live";
            return (
              <div
                key={c.id}
                className={cn(
                  "anim-fade-up relative flex overflow-hidden rounded-[1.2rem] bg-white shadow-sm",
                  !live && "opacity-60"
                )}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div
                  className={cn(
                    "flex w-[92px] shrink-0 flex-col items-center justify-center py-4",
                    live ? "bg-mustard" : "bg-cocoa/15"
                  )}
                >
                  <span className="font-display text-lg font-extrabold text-cocoa">{naira(c.discount)}</span>
                  <span className="text-[10px] font-extrabold text-cocoa/65">off</span>
                </div>
                <div className="absolute bottom-1 top-1 left-[92px] border-l-2 border-dashed border-cocoa/15" />
                <span className="absolute -top-2 left-[92px] h-4 w-4 -translate-x-1/2 rounded-full bg-cream" />
                <span className="absolute -bottom-2 left-[92px] h-4 w-4 -translate-x-1/2 rounded-full bg-cream" />
                <div className="flex-1 p-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[14.5px] font-bold text-cocoa">{c.title}</p>
                    {live && c.expiresAt ? (
                      <span className="shrink-0 rounded-full bg-[#E4F3E7] px-2.5 py-1 text-[10.5px] font-extrabold text-leaf">
                        Expires {shortDate(c.expiresAt)}
                      </span>
                    ) : (
                      <span className="shrink-0 rounded-full bg-cocoa/10 px-2.5 py-1 text-[10.5px] font-extrabold text-cocoa/50">
                        {c.status === "used" ? "Used" : "Expired"}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-cocoa/55">{c.detail}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
