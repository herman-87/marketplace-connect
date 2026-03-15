import { Check, ShoppingCart, ClipboardList, PackageCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CheckoutStep } from "@/types/order";

interface CheckoutProgressProps {
  currentStep: CheckoutStep;
  onStepClick?: (step: CheckoutStep) => void;
}

const steps: { id: CheckoutStep; label: string; icon: React.ElementType }[] = [
  { id: 'cart', label: 'Panier', icon: ShoppingCart },
  { id: 'delivery', label: 'Commande', icon: ClipboardList },
  { id: 'confirmation', label: 'Récapitulatif', icon: PackageCheck },
];

const stepOrder: CheckoutStep[] = ['cart', 'delivery', 'confirmation'];

export function CheckoutProgress({ currentStep, onStepClick }: CheckoutProgressProps) {
  const currentIndex = stepOrder.indexOf(currentStep);

  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepIndex = stepOrder.indexOf(step.id);
          const isCompleted = stepIndex < currentIndex;
          const isCurrent = step.id === currentStep;
          const isClickable = stepIndex < currentIndex && onStepClick;
          const Icon = step.icon;

          return (
            <div key={step.id} className="flex items-center flex-1 last:flex-none">
              <button
                onClick={() => isClickable && onStepClick(step.id)}
                disabled={!isClickable}
                className={cn(
                  "relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all",
                  isCompleted && "bg-primary border-primary text-primary-foreground cursor-pointer hover:bg-primary/90",
                  isCurrent && "bg-primary border-primary text-primary-foreground",
                  !isCompleted && !isCurrent && "bg-muted border-border text-muted-foreground",
                  isClickable && "cursor-pointer"
                )}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </button>

              {index < steps.length - 1 && (
                <div className="flex-1 mx-2">
                  <div 
                    className={cn(
                      "h-1 rounded-full transition-all",
                      stepIndex < currentIndex ? "bg-primary" : "bg-border"
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="hidden sm:flex items-center justify-between mt-2">
        {steps.map((step, index) => {
          const stepIndex = stepOrder.indexOf(step.id);
          const isCompleted = stepIndex < currentIndex;
          const isCurrent = step.id === currentStep;

          return (
            <div 
              key={`label-${step.id}`} 
              className={cn(
                "text-xs font-medium transition-colors flex-1 last:flex-none",
                index === 0 && "text-left",
                index === steps.length - 1 && "text-right",
                index > 0 && index < steps.length - 1 && "text-center",
                (isCompleted || isCurrent) ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {step.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}
