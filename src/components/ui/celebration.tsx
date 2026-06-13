import { useEffect, useState, useMemo } from "react";
import { CheckCircle2, PartyPopper, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type CelebrationVariant = "success" | "party" | "sparkle";

type CelebrationPayload = {
  title: string;
  message?: string;
  variant?: CelebrationVariant;
  duration?: number;
  emoji?: string;
};

type State = { id: number; data: CelebrationPayload } | null;

const listeners = new Set<(s: State) => void>();
let current: State = null;
let counter = 0;

export function celebrate(data: CelebrationPayload) {
  current = { id: ++counter, data };
  listeners.forEach((l) => l(current));
}

function dismiss() {
  current = null;
  listeners.forEach((l) => l(current));
}

const ICONS: Record<CelebrationVariant, React.ComponentType<any>> = {
  success: CheckCircle2,
  party: PartyPopper,
  sparkle: Sparkles,
};

export function CelebrationOverlay() {
  const [state, setState] = useState<State>(current);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    listeners.add(setState);
    return () => {
      listeners.delete(setState);
    };
  }, []);

  useEffect(() => {
    if (!state) {
      setVisible(false);
      return;
    }
    setVisible(true);
    const duration = state.data.duration ?? 2600;
    const t = setTimeout(() => setVisible(false), duration);
    const t2 = setTimeout(dismiss, duration + 350);
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
    };
  }, [state?.id]);

  const confetti = useMemo(
    () =>
      Array.from({ length: 26 }).map((_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.4,
        duration: 1.6 + Math.random() * 1.4,
        rotate: Math.random() * 360,
        size: 6 + Math.random() * 8,
        hue: Math.floor(Math.random() * 360),
      })),
    [state?.id]
  );

  if (!state) return null;

  const variant = state.data.variant ?? "success";
  const Icon = ICONS[variant];

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-[100] flex justify-center px-4",
        "transition-all duration-500 ease-out",
        visible
          ? "opacity-100 translate-y-[12vh]"
          : "opacity-0 -translate-y-8"
      )}
      aria-live="polite"
    >
      {/* Confetti layer */}
      <div className="absolute inset-x-0 top-0 h-[40vh] overflow-hidden pointer-events-none">
        {visible &&
          confetti.map((c, i) => (
            <span
              key={i}
              className="absolute top-0 rounded-sm"
              style={{
                left: `${c.left}%`,
                width: `${c.size}px`,
                height: `${c.size * 0.4}px`,
                backgroundColor: `hsl(${c.hue} 85% 60%)`,
                transform: `rotate(${c.rotate}deg)`,
                animation: `celebrate-fall ${c.duration}s ${c.delay}s cubic-bezier(.2,.6,.4,1) forwards`,
              }}
            />
          ))}
      </div>

      {/* Card */}
      <div
        className={cn(
          "relative pointer-events-auto",
          "min-w-[260px] max-w-[92vw] sm:max-w-md",
          "rounded-2xl border border-border bg-background/95 backdrop-blur-xl",
          "shadow-2xl px-5 py-4 sm:px-6 sm:py-5",
          "flex items-center gap-4",
          visible ? "animate-scale-in" : ""
        )}
      >
        <div className="relative shrink-0">
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/15 flex items-center justify-center">
            <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-primary" strokeWidth={2.2} />
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-base sm:text-lg leading-tight flex items-center gap-1.5">
            {state.data.emoji && <span className="text-xl">{state.data.emoji}</span>}
            <span className="truncate">{state.data.title}</span>
          </p>
          {state.data.message && (
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 line-clamp-2">
              {state.data.message}
            </p>
          )}
        </div>
      </div>

      <style>{`
        @keyframes celebrate-fall {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(40vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
