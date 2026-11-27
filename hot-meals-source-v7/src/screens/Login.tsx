import { useMemo, useState } from "react";
import { IconCheck, LogoPot } from "../components/Icons";
import { Photo } from "../components/Photo";
import { useApp } from "../lib/appState";
import { firstName, normalizePhone } from "../lib/store";

export function Login({ onDone }: { onDone: () => void }) {
  const { login, knownPhoneName } = useApp();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const valid = useMemo(() => normalizePhone(phone) !== null, [phone]);
  const known = useMemo(() => (valid ? knownPhoneName(phone) : null), [valid, phone, knownPhoneName]);

  const onPhone = (v: string) => {
    setPhone(v);
    const k = knownPhoneName(v);
    if (k && name.trim() === "") setName(k);
  };

  const canGo = valid && name.trim().length >= 2;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canGo) return;
    if (login(name, phone)) onDone();
  };

  return (
    <div className="relative flex h-full flex-col bg-cocoa">
      <Photo name="login-bg.jpg" alt="Hot Meals spread" className="absolute inset-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-cocoa/85 via-cocoa/25 to-cocoa/45" />

      <div className="relative z-10 flex items-center gap-2.5 px-6 pt-12">
        <LogoPot className="h-9 w-9 text-mustard" />
        <span className="font-display text-xl font-bold text-white">Hot Meals</span>
      </div>

      <div className="relative z-10 mt-auto mb-6 px-6">
        <h1 className="font-display text-[32px] font-extrabold leading-[1.1] text-white">
          Hot food for lecture days
        </h1>
        <p className="mt-2 text-[15px] text-cream/85">From the Permanent Site kitchen to your spot, fast.</p>
      </div>

      <form
        onSubmit={submit}
        className="anim-rise relative z-10 rounded-t-[2.2rem] bg-white px-6 pt-4 pb-[max(1.6rem,env(safe-area-inset-bottom))] shadow-[0_-20px_50px_rgba(43,29,22,0.25)]"
      >
        <div className="mx-auto h-1.5 w-10 rounded-full bg-cocoa/15" />
        <h2 className="mt-4 font-display text-[26px] font-extrabold text-cocoa">Let's get you fed</h2>
        <p className="mt-1 text-sm text-cocoa/60">Enter your name and number so our riders can call you.</p>

        <div className="mt-5 space-y-3.5">
          <div>
            <label htmlFor="hm-name" className="mb-1.5 ml-1 block text-[13px] font-bold text-cocoa/70">
              Full name
            </label>
            <input
              id="hm-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Chidera Bala"
              autoComplete="name"
              className="w-full rounded-[1.4rem] bg-cream px-5 py-4 text-[15px] font-medium text-cocoa outline-none ring-2 ring-transparent transition placeholder:text-cocoa/35 focus:ring-mustard"
            />
          </div>
          <div>
            <label htmlFor="hm-phone" className="mb-1.5 ml-1 block text-[13px] font-bold text-cocoa/70">
              Phone number
            </label>
            <input
              id="hm-phone"
              value={phone}
              onChange={(e) => onPhone(e.target.value)}
              placeholder="0803 123 4567"
              inputMode="tel"
              autoComplete="tel"
              className="w-full rounded-[1.4rem] bg-cream px-5 py-4 text-[15px] font-medium tracking-wide text-cocoa outline-none ring-2 ring-transparent transition placeholder:text-cocoa/35 focus:ring-mustard"
            />
            <div className="mt-1.5 flex h-5 items-center gap-1.5 pl-1">
              {phone.length > 0 && !valid && (
                <p className="text-[13px] font-semibold text-rust">Enter a valid 10 or 11 digit number</p>
              )}
              {valid && known && (
                <p className="anim-fade flex items-center gap-1.5 text-[13px] font-bold text-leaf">
                  <IconCheck className="h-4 w-4" /> Welcome back, {firstName(known)}
                </p>
              )}
              {valid && !known && (
                <p className="anim-fade flex items-center gap-1.5 text-[13px] font-semibold text-cocoa/50">
                  <IconCheck className="h-4 w-4" /> Looks good, you are new here
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={!canGo}
            className="press w-full rounded-full bg-flame py-4 font-display text-lg font-bold text-white shadow-[0_16px_32px_-12px_rgba(214,35,42,0.65)] disabled:opacity-40 disabled:shadow-none"
          >
            Continue
          </button>
          <p className="pb-1 text-center text-xs leading-relaxed text-cocoa/50">
            No password needed. We confirm orders by your name and the last 4 digits of this number.
          </p>
        </div>
      </form>
    </div>
  );
}
