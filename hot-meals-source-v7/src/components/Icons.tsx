type P = { className?: string };

const S = ({ className = "", children, filled = false }: P & { children: React.ReactNode; filled?: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke={filled ? "none" : "currentColor"}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {children}
  </svg>
);

export const IconHome = (p: P) => (
  <S {...p}>
    <path d="m3 10.5 9-7.5 9 7.5" />
    <path d="M5 9.5V21h5v-6h4v6h5V9.5" />
  </S>
);

export const IconReceipt = (p: P) => (
  <S {...p}>
    <path d="M6 2.5h12v19l-3-2-3 2-3-2-3 2z" />
    <path d="M9.5 8h5M9.5 12h5" />
  </S>
);

export const IconGift = (p: P) => (
  <S {...p}>
    <rect x="3" y="8" width="18" height="4" rx="1" />
    <path d="M5 12v9h14v-9M12 8v13" />
    <path d="M12 8s-4.6.2-5.6-2.1C5.6 4.1 7.4 2.9 9 3.6 10.8 4.5 12 8 12 8Z" />
    <path d="M12 8s4.6.2 5.6-2.1c.8-1.8-1-3-2.6-2.3C13.2 4.5 12 8 12 8Z" />
  </S>
);

export const IconBasket = (p: P) => (
  <S {...p}>
    <path d="M4 9h16l-1.6 11.2a2 2 0 0 1-2 1.8H7.6a2 2 0 0 1-2-1.8Z" />
    <path d="M8 9c0-4 1.5-6.2 4-6.2S16 5 16 9" />
  </S>
);

export const IconPlus = (p: P) => (
  <S {...p}>
    <path d="M12 5v14M5 12h14" />
  </S>
);

export const IconMinus = (p: P) => (
  <S {...p}>
    <path d="M5 12h14" />
  </S>
);

export const IconArrowLeft = (p: P) => (
  <S {...p}>
    <path d="M19 12H5" />
    <path d="m11 18-6-6 6-6" />
  </S>
);

export const IconArrowRight = (p: P) => (
  <S {...p}>
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </S>
);

export const IconSearch = (p: P) => (
  <S {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </S>
);

export const IconPin = (p: P) => (
  <S {...p}>
    <path d="M12 21s-7-5.3-7-11a7 7 0 0 1 14 0c0 5.7-7 11-7 11Z" />
    <circle cx="12" cy="10" r="2.6" />
  </S>
);

export const IconCheck = (p: P) => (
  <S {...p}>
    <path d="m5 12.5 4.5 4.5L19 7" />
  </S>
);

export const IconClose = (p: P) => (
  <S {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </S>
);

export const IconChevronRight = (p: P) => (
  <S {...p}>
    <path d="m9 6 6 6-6 6" />
  </S>
);

export const IconChevronDown = (p: P) => (
  <S {...p}>
    <path d="m6 9 6 6 6-6" />
  </S>
);

export const IconBike = (p: P) => (
  <S {...p}>
    <circle cx="6" cy="17" r="3.4" />
    <circle cx="18" cy="17" r="3.4" />
    <path d="M6 17 9.2 9h5.6L18 17" />
    <path d="M9.2 9 7.6 5.8H5.4" />
    <path d="m12.2 17-1.4-4.6" />
  </S>
);

export const IconBag = (p: P) => (
  <S {...p}>
    <path d="M6 8h12l1 13H5L6 8Z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </S>
);

export const IconCash = (p: P) => (
  <S {...p}>
    <rect x="2.5" y="6.5" width="19" height="11" rx="2" />
    <circle cx="12" cy="12" r="2.5" />
    <path d="M6 10v.01M18 14v.01" />
  </S>
);

export const IconPhonePay = (p: P) => (
  <S {...p}>
    <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
    <path d="M11 18.5h2" />
  </S>
);

export const IconCopy = (p: P) => (
  <S {...p}>
    <rect x="9" y="9" width="12" height="12" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </S>
);

export const IconFlame = (p: P) => (
  <S {...p}>
    <path d="M12 3s5 4.6 5 9a5 5 0 0 1-10 0c0-2 .9-3.6 2-5.1.5 1.5 1.4 2.1 1.4 2.1C10 7 10.5 5 12 3Z" />
  </S>
);

export const IconTicket = (p: P) => (
  <S {...p}>
    <path d="M3 9V6a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v3a2.5 2.5 0 0 0 0 6v3a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-3a2.5 2.5 0 0 0 0-6Z" />
    <path d="M14 5v14" strokeDasharray="2.5 3" />
  </S>
);

// Filled red pot, the brand mark
export const LogoPot = ({ className = "" }: P) => (
  <svg viewBox="0 0 48 48" className={className} fill="currentColor" aria-hidden="true">
    <rect x="20" y="8" width="8" height="5" rx="2.5" />
    <rect x="9" y="15" width="30" height="5" rx="2.5" />
    <path d="M12 23h24v5.5A12 12 0 0 1 24 40.5 12 12 0 0 1 12 28.5Z" />
    <path d="M9 24.5c-2.6 0-4.5 1.7-4.5 3.7S6.4 32 9 32" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
    <path d="M39 24.5c2.6 0 4.5 1.7 4.5 3.7S41.6 32 39 32" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
  </svg>
);

// Small pot used as a loyalty stamp
export const IconPotStamp = (p: P) => (
  <S {...p} filled>
    <path d="M9 5.5h6v1.6H9z" />
    <path d="M5.5 8.8h13v1.9h-13z" />
    <path d="M7 12h10v2.6a5 5 0 0 1-5 5 5 5 0 0 1-5-5Z" />
  </S>
);
