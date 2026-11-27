import { useEffect, useState } from "react";
import { IconGift, IconHome, IconReceipt } from "../components/Icons";
import { useApp } from "../lib/appState";
import { naira } from "../lib/store";
import { cn } from "../utils/cn";
import { HomeTab } from "./HomeTab";
import { OrdersTab } from "./OrdersTab";
import { RewardsTab } from "./RewardsTab";

export type TabId = "home" | "orders" | "rewards";

type Props = {
  initialTab?: TabId;
  onOpenFood: (id: string) => void;
  onOpenCart: () => void;
  onOpenOwner: () => void;
};

const TABS: { id: TabId; label: string; icon: (p: { className?: string }) => React.ReactNode }[] = [
  { id: "home", label: "Home", icon: IconHome },
  { id: "orders", label: "Orders", icon: IconReceipt },
  { id: "rewards", label: "Rewards", icon: IconGift },
];

export function Main({ initialTab = "home", onOpenFood, onOpenCart, onOpenOwner }: Props) {
  const { cartCount, subtotal } = useApp();
  const [tab, setTab] = useState<TabId>(initialTab);
  useEffect(() => setTab(initialTab), [initialTab]);

  return (
    <div className="relative h-full bg-cream">
      {tab === "home" && (
        <div key="home" className="anim-fade absolute inset-0">
          <HomeTab onOpenFood={onOpenFood} onOpenCart={onOpenCart} onOpenOwner={onOpenOwner} />
        </div>
      )}
      {tab === "orders" && (
        <div key="orders" className="anim-fade absolute inset-0">
          <OrdersTab onBrowse={() => setTab("home")} onGoCart={onOpenCart} />
        </div>
      )}
      {tab === "rewards" && (
        <div key="rewards" className="anim-fade absolute inset-0">
          <RewardsTab />
        </div>
      )}

      {cartCount > 0 && (
        <button
          onClick={onOpenCart}
          className="cart-bar press anim-rise absolute inset-x-5 bottom-[6.4rem] z-30 flex items-center justify-between rounded-full bg-flame px-5 py-3.5 text-white"
        >
          <span className="flex items-center gap-2.5">
            <span key={cartCount} className="anim-pop flex h-7 min-w-7 items-center justify-center rounded-full bg-white px-1.5 text-[13px] font-extrabold text-flame">
              {cartCount}
            </span>
            <span className="font-display text-[17px]">View cart</span>
          </span>
          <span key={subtotal} className="anim-pop font-display text-[17px]">{naira(subtotal)}</span>
        </button>
      )}

      <nav className="absolute inset-x-5 bottom-5 z-30 flex rounded-full bg-cocoa p-2 shadow-[0_20px_45px_-14px_rgba(43,29,22,0.75)]">
        {TABS.map((t) => {
          const active = tab === t.id;
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "press flex flex-1 items-center justify-center gap-2 rounded-full py-2.5",
                active ? "nav-active text-cocoa" : "text-cream/55"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[13px] font-bold">{t.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
