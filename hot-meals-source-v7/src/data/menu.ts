// Central menu file. Edit prices and dishes here, the whole app follows.

export type Extra = {
  id: string;
  name: string;
  price: number;
  photo: string;
};

export type PickGroup = {
  id: string;
  title: string;
  options: string[];
};

export type MenuItem = {
  id: string;
  name: string;
  price: number;
  category: "Rice" | "Swallow" | "Drinks" | "Snacks";
  photo: string;
  tags: string[];
  desc: string;
  extras?: Extra[];
  picks?: PickGroup[];
};

export const DELIVERY_FEE = 300;

export const EXTRAS: Extra[] = [
  { id: "peppered-chicken", name: "Peppered chicken", price: 1500, photo: "peppered-chicken.jpg" },
  { id: "peppered-beef", name: "Peppered beef", price: 800, photo: "peppered-beef.jpg" },
  { id: "peppered-gizzard", name: "Peppered gizzard", price: 800, photo: "peppered-gizzard.jpg" },
  { id: "coleslaw", name: "Coleslaw", price: 300, photo: "coleslaw.jpg" },
];

export const SWALLOW_PICKS: PickGroup[] = [
  { id: "swallow", title: "Choose your swallow", options: ["Amala", "Eba", "Fufu", "Pounded yam"] },
  { id: "soup", title: "Choose your soup", options: ["Egusi", "Bitterleaf"] },
];

export const MENU: MenuItem[] = [
  {
    id: "jollof-rice",
    name: "Jollof rice",
    price: 1500,
    category: "Rice",
    photo: "jollof-rice.jpg",
    tags: ["Smoky", "Spicy", "Hearty"],
    desc: "Party-style jollof cooked the firewood way, served with fried plantain and our pepper sauce.",
    extras: EXTRAS,
  },
  {
    id: "fried-rice",
    name: "Fried rice",
    price: 1500,
    category: "Rice",
    photo: "fried-rice.jpg",
    tags: ["Savoury", "Fresh", "Filling"],
    desc: "Nigerian fried rice tossed with carrots, sweet corn and green peas. Light, tasty and well packed.",
    extras: EXTRAS,
  },
  {
    id: "stir-fried-pasta",
    name: "Stir-fried pasta",
    price: 1500,
    category: "Rice",
    photo: "stir-fried-pasta.jpg",
    tags: ["Saucy", "Peppery", "Loaded"],
    desc: "Pasta stir-fried in a rich tomato and pepper sauce with vegetables and sliced sausage.",
    extras: EXTRAS,
  },
  {
    id: "swallow-and-soup",
    name: "Swallow and soup",
    price: 1000,
    category: "Swallow",
    photo: "swallow-and-soup.jpg",
    tags: ["Hot bowl", "Traditional", "Filling"],
    desc: "Soft swallow of your choice served with a bowl of rich, peppery soup and assorted meat.",
    picks: SWALLOW_PICKS,
  },
  {
    id: "coke",
    name: "Coke",
    price: 400,
    category: "Drinks",
    photo: "coke.jpg",
    tags: ["Ice-cold", "Bottled", "50cl"],
    desc: "Coca-Cola in a sealed bottle, served chilled.",
  },
  {
    id: "sprite",
    name: "Sprite",
    price: 400,
    category: "Drinks",
    photo: "sprite.jpg",
    tags: ["Ice-cold", "Bottled", "50cl"],
    desc: "Sprite in a sealed bottle, served chilled.",
  },
  {
    id: "fanta",
    name: "Fanta",
    price: 400,
    category: "Drinks",
    photo: "fanta.jpg",
    tags: ["Ice-cold", "Bottled", "50cl"],
    desc: "Fanta Orange in a sealed bottle, served chilled.",
  },
  {
    id: "la-casera",
    name: "La Casera",
    price: 400,
    category: "Drinks",
    photo: "la-casera.jpg",
    tags: ["Ice-cold", "Bottled", "50cl"],
    desc: "La Casera apple soda in a sealed bottle, served chilled.",
  },
  {
    id: "nutri-milk",
    name: "Nutri Milk",
    price: 400,
    category: "Drinks",
    photo: "nutri-milk.jpg",
    tags: ["Chilled", "Bottled", "Creamy"],
    desc: "Nutri Milk in a sealed bottle, served chilled.",
  },
];

// Categories with no dishes stay hidden (Snacks is empty on purpose).
export const CATEGORIES = (["Rice", "Swallow", "Drinks", "Snacks"] as const)
  .map((name) => ({ name, items: MENU.filter((m) => m.category === name) }))
  .filter((c) => c.items.length > 0);

export const SPOTS = [
  "Permanent Site",
  "Bus Park",
  "Faculty of Art",
  "Multipurpose Hall",
  "Library",
  "Hostel",
  "Other",
];

export const CAMPUSES = ["Permanent Site", "Bus Park"];

export const ONBOARDING_SLIDES = [
  {
    photo: "onboarding-1.jpg",
    title: "Hot food, right at your spot",
    sub: "Jollof, swallow and cold drinks delivered to your corner of campus, Permanent Site or Bus Park.",
  },
  {
    photo: "onboarding-2.jpg",
    title: "Order in two taps",
    sub: "Pick a dish, choose your spot, and pay when it gets to you. No stress, no queues.",
  },
  {
    photo: "onboarding-3.jpg",
    title: "A stamp with every order",
    sub: "Collect five stamps and get 500 naira off. Loyalty tastes better.",
  },
];

// Numbers below are samples for the owner view demo only.
export const OWNER_SAMPLE = {
  today: 48500,
  todayDelta: "+12% vs yesterday",
  week: 212400,
  ordersToday: 31,
  ordersWeek: 141,
  avgOrder: 1565,
  weekBars: [
    { day: "Mon", value: 18200 },
    { day: "Tue", value: 22400 },
    { day: "Wed", value: 19800 },
    { day: "Thu", value: 26500 },
    { day: "Fri", value: 31200 },
    { day: "Sat", value: 45800 },
    { day: "Sun", value: 48500 },
  ],
  topCustomers: [
    { name: "Adaeze O.", orders: 14, total: 23400 },
    { name: "Terna B.", orders: 11, total: 18200 },
    { name: "Chiamaka E.", orders: 10, total: 15900 },
    { name: "Ibrahim M.", orders: 8, total: 12400 },
    { name: "Folake A.", orders: 6, total: 9800 },
  ],
  topLocations: [
    { name: "Permanent Site", pct: 46 },
    { name: "Bus Park", pct: 27 },
    { name: "Hostel", pct: 15 },
    { name: "Library", pct: 7 },
    { name: "Faculty of Art", pct: 5 },
  ],
};
