import { useEffect } from "react";

export function Splash({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = window.setTimeout(onDone, 2200);
    return () => window.clearTimeout(t);
  }, [onDone]);

  return (
    <div className="flow-hot relative flex h-full flex-col items-center justify-center">
      <img src="logo.png" alt="Hot Meals" draggable={false} className="logo-pop w-[80%] max-w-[360px]" />
      <div className="absolute bottom-24 left-1/2 h-1.5 w-44 -translate-x-1/2 overflow-hidden rounded-full bg-white/25">
        <div className="loadbar h-full rounded-full bg-mustard" />
      </div>
    </div>
  );
}
