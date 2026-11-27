import { useCallback, useRef, useState } from "react";
import { IconCheck, IconClose } from "./components/Icons";
import { AppProvider, useApp } from "./lib/appState";
import type { Order } from "./lib/store";
import { cn } from "./utils/cn";
import { Cart } from "./screens/Cart";
import { Checkout } from "./screens/Checkout";
import { Confirmed } from "./screens/Confirmed";
import { Food } from "./screens/Food";
import { Login } from "./screens/Login";
import { Main } from "./screens/Main";
import type { TabId } from "./screens/Main";
import { Onboarding } from "./screens/Onboarding";
import { Owner } from "./screens/Owner";
import { Splash } from "./screens/Splash";

type ScreenName =
  | "splash"
  | "onboarding"
  | "login"
  | "main"
  | "food"
  | "cart"
  | "checkout"
  | "confirmed"
  | "owner";

type Screen = {
  id: number;
  name: ScreenName;
  params?: { itemId?: string; order?: Order; tab?: TabId };
};

let nextId = 1;

function Shell() {
  const { user, onboarded, markOnboarded, toast, dismissToast } = useApp();
  const [stack, setStack] = useState<Screen[]>(() => [{ id: nextId++, name: "splash" }]);
  const [exitingId, setExitingId] = useState<number | null>(null);

  const stackRef = useRef(stack);
  stackRef.current = stack;
  const exitingRef = useRef<number | null>(null);
  const userRef = useRef(user);
  userRef.current = user;
  const onboardedRef = useRef(onboarded);
  onboardedRef.current = onboarded;
  const pushLock = useRef(0);

  const push = useCallback((name: ScreenName, params?: Screen["params"]) => {
    const now = Date.now();
    if (now - pushLock.current < 250 || exitingRef.current !== null) return;
    pushLock.current = now;
    setStack((s) => [...s, { id: nextId++, name, params }]);
  }, []);

  const pop = useCallback(() => {
    const s = stackRef.current;
    if (s.length <= 1 || exitingRef.current !== null) return;
    const top = s[s.length - 1];
    exitingRef.current = top.id;
    setExitingId(top.id);
    window.setTimeout(() => {
      setStack((x) => x.filter((v) => v.id !== top.id));
      exitingRef.current = null;
      setExitingId(null);
    }, 330);
  }, []);

  const reset = useCallback((name: ScreenName, params?: Screen["params"]) => {
    if (exitingRef.current !== null) return;
    setStack([{ id: nextId++, name, params }]);
  }, []);

  const onSplashDone = useCallback(() => {
    if (userRef.current) reset("main", { tab: "home" });
    else if (onboardedRef.current) reset("login");
    else reset("onboarding");
  }, [reset]);

  const onOnboardDone = useCallback(() => {
    markOnboarded();
    reset("login");
  }, [markOnboarded, reset]);

  const onLoginDone = useCallback(() => reset("main", { tab: "home" }), [reset]);

  const openCartFromFood = useCallback(() => {
    setStack((s) => {
      const top = s[s.length - 1];
      if (top && top.name === "food") return [...s.slice(0, -1), { id: nextId++, name: "cart" }];
      return [...s, { id: nextId++, name: "cart" }];
    });
  }, []);

  const render = (s: Screen) => {
    switch (s.name) {
      case "splash":
        return <Splash onDone={onSplashDone} />;
      case "onboarding":
        return <Onboarding onDone={onOnboardDone} />;
      case "login":
        return <Login onDone={onLoginDone} />;
      case "main":
        return (
          <Main
            initialTab={s.params?.tab ?? "home"}
            onOpenFood={(id) => push("food", { itemId: id })}
            onOpenCart={() => push("cart")}
            onOpenOwner={() => push("owner")}
          />
        );
      case "food":
        return <Food itemId={s.params?.itemId ?? ""} onBack={pop} onGoCart={openCartFromFood} />;
      case "cart":
        return <Cart onBack={pop} onCheckout={() => push("checkout")} />;
      case "checkout":
        return <Checkout onBack={pop} onPlaced={(order) => push("confirmed", { order })} />;
      case "confirmed":
        return (
          <Confirmed
            order={s.params?.order as Order}
            onHome={() => reset("main", { tab: "home" })}
            onOrders={() => reset("main", { tab: "orders" })}
          />
        );
      case "owner":
        return <Owner onClose={pop} />;
    }
  };

  return (
    <div className="app-backdrop">
      <div className="app-column relative h-dvh w-full overflow-hidden bg-cream">
        {stack.map((s, i) => {
          const isTop = i === stack.length - 1;
          return (
            <div
              key={s.id}
              style={{ zIndex: i }}
              className={cn(
                "screen-base",
                isTop ? "screen-top" : "screen-under",
                isTop && s.name !== "splash" && "screen-enter",
                exitingId === s.id && "screen-exit"
              )}
            >
              {render(s)}
            </div>
          );
        })}

        {toast && (
          <div
            key={toast.id}
            className="pointer-events-none absolute inset-x-0 top-0 z-[80] px-4 pt-14"
          >
            <div className="anim-toast pointer-events-auto mx-auto flex max-w-[400px] items-center gap-3 rounded-2xl bg-cocoa p-3.5 pr-2.5 text-cream shadow-2xl">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-leaf">
                <IconCheck className="h-4 w-4 text-white" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13.5px] font-bold">{toast.title}</span>
                {toast.sub && <span className="block truncate text-[11.5px] text-cream/65">{toast.sub}</span>}
              </span>
              {toast.actionLabel && (
                <button
                  onClick={() => {
                    toast.onAction?.();
                    dismissToast();
                  }}
                  className="press shrink-0 rounded-full bg-cream px-3.5 py-2 text-[12px] font-extrabold text-cocoa"
                >
                  {toast.actionLabel}
                </button>
              )}
              <button
                onClick={dismissToast}
                className="press shrink-0 rounded-full p-1.5 text-cream/50"
                aria-label="Dismiss"
              >
                <IconClose className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
