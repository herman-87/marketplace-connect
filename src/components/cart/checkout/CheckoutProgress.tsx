import { Check, ShoppingCart, ClipboardList, PackageCheck, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CheckoutStep } from "@/types/order";

interface CheckoutProgressProps {
  currentStep: CheckoutStep;
  onStepClick?: (step: CheckoutStep) => void;
}

const steps: { id: CheckoutStep; label: string; icon: React.ElementType }[] = [
  { id: 'cart', label: 'Panier', icon: ShoppingCart },
  { id: 'delivery', label: 'Commande', icon: ClipboardList },
  { id: 'summary', label: 'Récapitulatif', icon: PackageCheck },
  { id: 'confirmation', label: 'Confirmation', icon: CheckCircle2 },
];

const stepOrder: CheckoutStep[] = ['cart', 'delivery', 'summary', 'confirmation'];

export function CheckoutProgress({ currentStep, onStepClick }: CheckoutProgressProps) {
  const currentIndex = stepOrder.indexOf(currentStep);

  if (currentStep === 'confirmation') return null;

  return (
    <div className="w-full py-4">
      <div className="flex items-start justify-between">
        {steps.map((step, index) => {
          const stepIndex = stepOrder.indexOf(step.id);
          const isCompleted = stepIndex < currentIndex;
          const isCurrent = step.id === currentStep;
          const isClickable = stepIndex < currentIndex && !!onStepClick;
          const Icon = step.icon;

          return (
            <div key={step.id} className="flex items-center flex-1 last:flex-none">
              {/* Icon + Label column */}
              <div className="flex flex-col items-center">
                <button
                  onClick={() => isClickable && onStepClick?.(step.id)}
                  disabled={!isClickable}
                  className={cn(
                    "relative flex items-center justify-center w-9 h-9 rounded-full border-2 transition-all",
                    isCompleted && "bg-primary border-primary text-primary-foreground cursor-pointer hover:bg-primary/90",
                    isCurrent && "bg-primary border-primary text-primary-foreground",
                    !isCompleted && !isCurrent && "bg-muted border-border text-muted-foreground",
                    isClickable && "cursor-pointer"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </button>
                <span
                  className={cn(
                    "text-[10px] leading-tight font-medium mt-1.5 text-center whitespace-nowrap",
                    (isCompleted || isCurrent) ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="flex-1 mx-1.5 -mt-4">
                  <div
                    className={cn(
                      "h-0.5 rounded-full transition-all",
                      stepIndex < currentIndex ? "bg-primary" : "bg-border"
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
