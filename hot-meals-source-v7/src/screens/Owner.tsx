import { IconClose } from "../components/Icons";
import { OWNER_SAMPLE } from "../data/menu";
import { naira } from "../lib/store";
import { cn } from "../utils/cn";

export function Owner({ onClose }: { onClose: () => void }) {
  const max = Math.max(...OWNER_SAMPLE.weekBars.map((b) => b.value));

  return (
    <div className="relative h-full bg-cocoa">
      <div className="no-scrollbar absolute inset-0 overflow-y-auto px-5 pt-14 pb-10 text-cream">
        <header className="flex items-start justify-between">
          <div>
            <h1 className="font-display text-[24px] font-extrabold text-cream">Owner view</h1>
            <span className="mt-1.5 inline-flex rounded-full bg-mustard px-3 py-1 text-[11px] font-extrabold text-cocoa">
              Sample data
            </span>
          </div>
          <button
            onClick={onClose}
            className="press flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-cream"
            aria-label="Close owner view"
          >
            <IconClose className="h-5 w-5" />
          </button>
        </header>

        <div className="mt-5 grid grid-cols-2 gap-3">
          {[
            { label: "Money today", value: naira(OWNER_SAMPLE.today), sub: OWNER_SAMPLE.todayDelta, good: true },
            { label: "Money this week", value: naira(OWNER_SAMPLE.week), sub: `${OWNER_SAMPLE.ordersWeek} orders` },
            { label: "Orders today", value: `${OWNER_SAMPLE.ordersToday}`, sub: `${naira(OWNER_SAMPLE.avgOrder)} average` },
            { label: "Top seller", value: "Jollof rice", sub: "12 plates today" },
          ].map((s, i) => (
            <div key={s.label} className="anim-fade-up rounded-[1.3rem] bg-white/8 p-4" style={{ animationDelay: `${i * 60}ms` }}>
              <p className="text-[11.5px] font-bold text-cream/55">{s.label}</p>
              <p className="mt-1 font-display text-[21px] font-extrabold leading-tight">{s.value}</p>
              <p className={cn("mt-1 text-[11px] font-bold", s.good ? "text-[#7BD89A]" : "text-cream/50")}>{s.sub}</p>
            </div>
          ))}
        </div>

        <section className="anim-fade-up mt-3 rounded-[1.3rem] bg-white/8 p-4" style={{ animationDelay: "240ms" }}>
          <div className="flex items-baseline justify-between">
            <h2 className="text-[14px] font-extrabold">Sales this week</h2>
            <span className="text-[10.5px] font-bold text-cream/45">Sample data</span>
          </div>
          <div className="mt-4 flex h-28 items-end gap-2">
            {OWNER_SAMPLE.weekBars.map((b, i) => {
              const isToday = i === OWNER_SAMPLE.weekBars.length - 1;
              return (
                <div key={b.day} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
                  <span className="text-[9.5px] font-bold text-cream/60">₦{(b.value / 1000).toFixed(1)}k</span>
                  <div
                    className={cn("w-full rounded-t-md", isToday ? "bg-cream" : "bg-mustard")}
                    style={{ height: `${Math.round((b.value / max) * 72)}%` }}
                  />
                  <span className={cn("text-[10px] font-bold", isToday ? "text-cream" : "text-cream/45")}>{b.day}</span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="anim-fade-up mt-3 rounded-[1.3rem] bg-white/8 p-4" style={{ animationDelay: "300ms" }}>
          <h2 className="text-[14px] font-extrabold">Top customers</h2>
          <div className="mt-3 space-y-3">
            {OWNER_SAMPLE.topCustomers.map((c) => {
              const initials = c.name
                .split(" ")
                .map((w) => w[0])
                .slice(0, 2)
                .join("");
              return (
                <div key={c.name} className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mustard text-[12px] font-extrabold text-cocoa">
                    {initials}
                  </span>
                  <span className="flex-1">
                    <span className="block text-[13.5px] font-bold">{c.name}</span>
                    <span className="block text-[11px] font-semibold text-cream/50">{c.orders} orders</span>
                  </span>
                  <span className="font-display text-[13.5px] font-extrabold text-mustard">{naira(c.total)}</span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="anim-fade-up mt-3 rounded-[1.3rem] bg-white/8 p-4" style={{ animationDelay: "360ms" }}>
          <h2 className="text-[14px] font-extrabold">Top locations</h2>
          <div className="mt-3 space-y-3.5">
            {OWNER_SAMPLE.topLocations.map((l) => (
              <div key={l.name}>
                <div className="flex justify-between text-[13px]">
                  <span className="font-bold">{l.name}</span>
                  <span className="font-bold text-cream/60">{l.pct}%</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-mustard" style={{ width: `${l.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <p className="mt-5 text-center text-[11px] leading-relaxed text-cream/40">
          All numbers above are samples for this demo. No live data is collected.
        </p>
      </div>
    </div>
  );
}
