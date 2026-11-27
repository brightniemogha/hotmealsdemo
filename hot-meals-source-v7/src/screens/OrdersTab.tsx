import { IconBasket } from "../components/Icons";
import { LogoPot } from "../components/Icons";
import { useApp } from "../lib/appState";
import { naira, when } from "../lib/store";

export function OrdersTab({ onBrowse, onGoCart }: { onBrowse: () => void; onGoCart: () => void }) {
  const { orders, reorder, showToast } = useApp();

  return (
    <div className="no-scrollbar h-full overflow-y-auto bg-cream pb-36">
      <header className="px-5 pt-14">
        <h1 className="font-display text-[26px] font-extrabold tracking-tight text-cocoa">Your orders</h1>
        <p className="mt-0.5 text-sm font-medium text-cocoa/55">
          {orders.length > 0 ? `${orders.length} ${orders.length === 1 ? "order" : "orders"} so far` : "Nothing yet"}
        </p>
      </header>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center px-6 pt-24 text-center">
          <LogoPot className="h-16 w-16 text-cocoa/15" />
          <p className="mt-4 font-display text-xl font-extrabold text-cocoa">No orders yet</p>
          <p className="mt-1 text-sm text-cocoa/55">Hot jollof is two taps away.</p>
          <button
            onClick={onBrowse}
            className="press mt-6 flex items-center gap-2 rounded-full bg-flame px-6 py-3 font-display text-[15px] font-bold text-white shadow-[0_14px_28px_-10px_rgba(214,35,42,0.65)]"
          >
            <IconBasket className="h-5 w-5" /> Order something hot
          </button>
        </div>
      ) : (
        <div className="mt-5 space-y-3.5 px-5">
          {orders.map((o, i) => {
            const fresh = i === 0 && Date.now() - o.createdAt < 120000;
            return (
              <article
                key={o.id}
                className="anim-fade-up rounded-[1.5rem] bg-white p-4 shadow-sm"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-display text-[15px] font-extrabold text-cocoa">{o.code}</span>
                  <span
                    className={
                      fresh
                        ? "rounded-full bg-mustard/35 px-2.5 py-1 text-[11px] font-extrabold text-cocoa"
                        : "rounded-full bg-[#E4F3E7] px-2.5 py-1 text-[11px] font-extrabold text-leaf"
                    }
                  >
                    {fresh ? "In progress" : "Delivered"}
                  </span>
                </div>
                <p className="mt-0.5 text-xs font-medium text-cocoa/50">
                  {when(o.createdAt)} · {o.spot}
                  {o.spotNote ? `, ${o.spotNote}` : ""}
                </p>
                <div className="mt-2.5 space-y-1">
                  {o.items.map((it, j) => (
                    <div key={j} className="flex items-baseline justify-between gap-3">
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
                <div className="mt-3 flex items-center justify-between border-t border-cocoa/10 pt-3">
                  <span className="font-display text-[15px] font-extrabold text-flame">{naira(o.total)}</span>
                  <button
                    onClick={() => {
                      reorder(o);
                      showToast({
                        title: "Added to cart",
                        sub: `${o.code} is back`,
                        actionLabel: "View Cart",
                        onAction: onGoCart,
                      });
                    }}
                    className="press rounded-full bg-mustard px-4 py-2 text-[12.5px] font-extrabold text-cocoa"
                  >
                    Reorder
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
