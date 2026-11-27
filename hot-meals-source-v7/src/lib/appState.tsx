import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { DELIVERY_FEE } from "../data/menu";
import type { CartLine, Coupon, Order, User } from "./store";
import { LS, genOrderCode, load, normalizePhone, save, seedCoupons } from "./store";

export type Toast = {
  id: number;
  title: string;
  sub?: string;
  actionLabel?: string;
  onAction?: () => void;
};

type PlaceOrderOpts = {
  spot: string;
  spotNote?: string;
  method: "delivery" | "pickup";
  payment: "cash" | "app";
};

type Ctx = {
  user: User | null;
  login: (name: string, rawPhone: string) => boolean;
  knownPhoneName: (raw: string) => string | null;
  onboarded: boolean;
  markOnboarded: () => void;
  cart: CartLine[];
  addToCart: (line: CartLine) => void;
  setQty: (key: string, qty: number) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  appliedCouponId: string | null;
  setAppliedCouponId: (id: string | null) => void;
  coupons: Coupon[];
  orders: Order[];
  placeOrder: (opts: PlaceOrderOpts) => Order | null;
  reorder: (order: Order) => void;
  spot: string;
  setSpot: (s: string) => void;
  toast: Toast | null;
  showToast: (t: Omit<Toast, "id">) => void;
  dismissToast: () => void;
};

const AppCtx = createContext<Ctx | null>(null);

export function useApp(): Ctx {
  const c = useContext(AppCtx);
  if (!c) throw new Error("useApp outside provider");
  return c;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => load<User | null>(LS.user, null));
  const [cart, setCart] = useState<CartLine[]>(() => load<CartLine[]>(LS.cart, []));
  const [orders, setOrders] = useState<Order[]>(() => load<Order[]>(LS.orders, []));
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const list = load<Coupon[] | null>(LS.coupons, null);
    if (list && list.length) {
      return list.map((c) =>
        c.status === "live" && c.expiresAt && c.expiresAt < Date.now()
          ? { ...c, status: "expired" as const }
          : c
      );
    }
    return seedCoupons(Date.now());
  });
  const [spot, setSpotState] = useState<string>(() => load<string>(LS.spot, "Permanent Site"));
  const [onboarded, setOnboarded] = useState<boolean>(() => load<boolean>(LS.onboarded, false));
  const [appliedCouponId, setAppliedCouponId] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const toastTimer = useRef<number | null>(null);

  useEffect(() => save(LS.cart, cart), [cart]);
  useEffect(() => save(LS.orders, orders), [orders]);
  useEffect(() => save(LS.coupons, coupons), [coupons]);
  useEffect(() => save(LS.spot, spot), [spot]);
  useEffect(() => save(LS.onboarded, onboarded), [onboarded]);

  const knownPhoneName = useCallback((raw: string): string | null => {
    const p = normalizePhone(raw);
    if (!p) return null;
    const users = load<Record<string, User>>(LS.users, {});
    return users[p]?.name ?? null;
  }, []);

  const login = useCallback((name: string, rawPhone: string): boolean => {
    const p = normalizePhone(rawPhone);
    if (!p) return false;
    const users = load<Record<string, User>>(LS.users, {});
    const existing = users[p];
    const u: User = existing
      ? { ...existing, name: name.trim() || existing.name }
      : { name: name.trim(), phone: p, joinedAt: Date.now() };
    users[p] = u;
    save(LS.users, users);
    save(LS.user, u);
    setUser(u);
    if (!existing) setCoupons(seedCoupons(Date.now()));
    return true;
  }, []);

  const markOnboarded = useCallback(() => setOnboarded(true), []);

  const addToCart = useCallback((line: CartLine) => {
    setCart((prev) => {
      const i = prev.findIndex((x) => x.key === line.key);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], qty: next[i].qty + line.qty };
        return next;
      }
      return [...prev, line];
    });
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setCart((prev) => (qty <= 0 ? prev.filter((l) => l.key !== key) : prev.map((l) => (l.key === key ? { ...l, qty } : l))));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const reorder = useCallback((order: Order) => {
    setCart((prev) => {
      let next = [...prev];
      for (const it of order.items) {
        const key = `${it.itemId}|${it.extras.join(",")}|${it.picks.join(",")}`;
        const line: CartLine = {
          key,
          itemId: it.itemId,
          name: it.name,
          photo: it.photo,
          // unitPrice already includes extras from the original order
          unitPrice: it.unitPrice,
          qty: it.qty,
          extras: it.extras.map((n) => ({ name: n, price: 0 })),
          picks: [...it.picks],
        };
        const i = next.findIndex((x) => x.key === key);
        if (i >= 0) {
          next[i] = { ...next[i], qty: next[i].qty + line.qty };
        } else {
          next = [...next, line];
        }
      }
      return next;
    });
  }, []);

  const subtotal = useMemo(() => cart.reduce((s, l) => s + l.unitPrice * l.qty, 0), [cart]);
  const cartCount = useMemo(() => cart.reduce((s, l) => s + l.qty, 0), [cart]);

  const placeOrder = useCallback(
    (opts: PlaceOrderOpts): Order | null => {
      if (cart.length === 0) return null;
      const coupon =
        coupons.find(
          (c) =>
            c.id === appliedCouponId &&
            c.status === "live" &&
            (!c.expiresAt || c.expiresAt > Date.now()) &&
            subtotal >= c.minOrder
        ) ?? null;
      const fee = opts.method === "delivery" ? DELIVERY_FEE : 0;
      const discount = coupon ? coupon.discount : 0;
      const order: Order = {
        id: `${Date.now()}`,
        code: genOrderCode(),
        createdAt: Date.now(),
        items: cart.map((l) => ({
          itemId: l.itemId,
          name: l.name,
          photo: l.photo,
          qty: l.qty,
          unitPrice: l.unitPrice,
          extras: l.extras.map((e) => e.name),
          picks: [...l.picks],
        })),
        subtotal,
        fee,
        discount,
        total: Math.max(0, subtotal + fee - discount),
        spot: opts.spot,
        spotNote: opts.spotNote,
        method: opts.method,
        payment: opts.payment,
        couponId: coupon?.id,
      };
      const newOrders = [order, ...orders];
      setOrders(newOrders);
      setCart([]);
      setAppliedCouponId(null);
      setCoupons((prev) => {
        let next = coupon ? prev.map((c) => (c.id === coupon.id ? { ...c, status: "used" as const } : c)) : prev;
        // every 5th order unlocks a 500 naira reward coupon
        if (newOrders.length > 0 && newOrders.length % 5 === 0) {
          next = [
            {
              id: `stamp-${newOrders.length}`,
              title: "Stamp reward",
              detail: "500 naira off your next order, any amount",
              discount: 500,
              minOrder: 0,
              expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
              status: "live" as const,
            },
            ...next,
          ];
        }
        return next;
      });
      return order;
    },
    [cart, coupons, appliedCouponId, subtotal, orders]
  );

  const setSpot = useCallback((s: string) => setSpotState(s), []);

  const dismissToast = useCallback(() => {
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    setToast(null);
  }, []);

  const showToast = useCallback((t: Omit<Toast, "id">) => {
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    setToast({ id: Date.now(), ...t });
    toastTimer.current = window.setTimeout(() => setToast(null), 2800);
  }, []);

  const value: Ctx = {
    user,
    login,
    knownPhoneName,
    onboarded,
    markOnboarded,
    cart,
    addToCart,
    setQty,
    clearCart,
    cartCount,
    subtotal,
    appliedCouponId,
    setAppliedCouponId,
    coupons,
    orders,
    placeOrder,
    reorder,
    spot,
    setSpot,
    toast,
    showToast,
    dismissToast,
  };

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}
