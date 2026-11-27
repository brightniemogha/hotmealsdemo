// Types, localStorage helpers and small utils. All state is mock and local.

export type User = {
  name: string;
  phone: string;
  joinedAt: number;
};

export type CartLine = {
  key: string;
  itemId: string;
  name: string;
  photo: string;
  unitPrice: number;
  qty: number;
  extras: { name: string; price: number }[];
  picks: string[];
};

export type OrderItem = {
  itemId: string;
  name: string;
  photo: string;
  qty: number;
  unitPrice: number;
  extras: string[];
  picks: string[];
};

export type Order = {
  id: string;
  code: string;
  createdAt: number;
  items: OrderItem[];
  subtotal: number;
  fee: number;
  discount: number;
  total: number;
  spot: string;
  spotNote?: string;
  method: "delivery" | "pickup";
  payment: "cash" | "app";
  couponId?: string;
};

export type Coupon = {
  id: string;
  title: string;
  detail: string;
  discount: number;
  minOrder: number;
  expiresAt: number | null;
  status: "live" | "expired" | "used";
};

export const LS = {
  user: "hm_user",
  users: "hm_users",
  cart: "hm_cart",
  orders: "hm_orders",
  coupons: "hm_coupons",
  onboarded: "hm_onboarded",
  spot: "hm_spot",
};

export function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage unavailable, demo continues in memory
  }
}

// Accepts 10 or 11 digits, with or without a leading 0 or +234.
export function normalizePhone(raw: string): string | null {
  const d = raw.replace(/\D/g, "");
  if (d.length === 13 && d.startsWith("234")) return d.slice(3);
  if (d.length === 11 && d.startsWith("0")) return d.slice(1);
  if (d.length === 10 || d.length === 11) return d;
  return null;
}

export const naira = (n: number) => `₦${Math.round(n).toLocaleString("en-NG")}`;

export const firstName = (name: string) => name.trim().split(/\s+/)[0];

export const genOrderCode = () => `HM${1000 + Math.floor(Math.random() * 9000)}`;

export function when(ts: number): string {
  const d = new Date(ts);
  const now = new Date();
  const time = d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) return `Today, ${time}`;
  return `${d.toLocaleDateString([], { month: "short", day: "numeric" })}, ${time}`;
}

export function shortDate(ts: number): string {
  return new Date(ts).toLocaleDateString([], { month: "short", day: "numeric" });
}

const DAY = 24 * 60 * 60 * 1000;

// Every new user starts with one live coupon and one expired one.
export function seedCoupons(now: number): Coupon[] {
  return [
    {
      id: "welcome",
      title: "Welcome back",
      detail: "500 naira off orders above 2,000",
      discount: 500,
      minOrder: 2000,
      expiresAt: now + 3 * DAY,
      status: "live",
    },
    {
      id: "campus-week",
      title: "Campus week",
      detail: "300 naira off orders above 1,500",
      discount: 300,
      minOrder: 1500,
      expiresAt: now - 4 * DAY,
      status: "expired",
    },
  ];
}
