import { 
  Clock, CheckCircle, XCircle, CreditCard, CheckCircle2, 
  Package, Truck, PackageCheck, Ban, AlertTriangle, AlertCircle 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { OrderStatus, ORDER_FLOW_STEPS, ORDER_STATUS_CONFIG, StatusHistoryEntry } from "@/types/order";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Clock, CheckCircle, XCircle, CreditCard, CheckCircle2,
  Package, Truck, PackageCheck, Ban, AlertTriangle, AlertCircle,
};

const colorMap: Record<string, string> = {
  success: "bg-green-500 text-white border-green-500",
  warning: "bg-warning text-white border-warning",
  destructive: "bg-destructive text-white border-destructive",
  secondary: "bg-muted-foreground/40 text-white border-muted-foreground/40",
  default: "bg-primary text-primary-foreground border-primary",
};

const lineColorMap: Record<string, string> = {
  success: "bg-green-500",
  warning: "bg-warning",
  destructive: "bg-destructive",
  secondary: "bg-muted-foreground/20",
  default: "bg-primary",
};

interface OrderTimelineProps {
  currentStatus: OrderStatus;
  statusHistory: StatusHistoryEntry[];
}

export function OrderTimeline({ currentStatus, statusHistory }: OrderTimelineProps) {
  const historyStatuses = new Set(statusHistory.map(h => h.status));
  const isTerminal = ['REJECTED', 'CANCELLED_BY_CLIENT', 'PAYMENT_FAILED', 'DELIVERY_FAILED', 'ACCEPTANCE_TIMEOUT', 'DISPUTED'].includes(currentStatus);

  // Build display steps: the normal flow steps that have been reached + terminal if applicable
  const displaySteps: { status: OrderStatus; entry?: StatusHistoryEntry; reached: boolean }[] = [];

  for (const step of ORDER_FLOW_STEPS) {
    const entry = statusHistory.find(h => h.status === step);
    const reached = historyStatuses.has(step);
    displaySteps.push({ status: step, entry, reached });
    if (step === currentStatus && !isTerminal) break;
    if (!reached && step !== currentStatus) {
      // Show future steps as unreached only if we haven't passed them
      if (ORDER_FLOW_STEPS.indexOf(step) > ORDER_FLOW_STEPS.indexOf(currentStatus)) {
        break;
      }
    }
  }

  // If terminal, show all reached + the terminal status
  if (isTerminal) {
    const terminalEntry = statusHistory.find(h => h.status === currentStatus);
    displaySteps.push({ status: currentStatus, entry: terminalEntry, reached: true });
  }

  // For non-terminal, show up to 2 upcoming steps as "pending"
  if (!isTerminal) {
    const currentIdx = ORDER_FLOW_STEPS.indexOf(currentStatus);
    for (let i = currentIdx + 1; i < Math.min(currentIdx + 3, ORDER_FLOW_STEPS.length); i++) {
      if (!historyStatuses.has(ORDER_FLOW_STEPS[i])) {
        displaySteps.push({ status: ORDER_FLOW_STEPS[i], reached: false });
      }
    }
  }

  return (
    <div className="space-y-0">
      {displaySteps.map((step, index) => {
        const config = ORDER_STATUS_CONFIG[step.status];
        const Icon = iconMap[config.icon] || Clock;
        const isLast = index === displaySteps.length - 1;
        const isCurrent = step.status === currentStatus;

        const formattedTime = step.entry?.timestamp
          ? new Date(step.entry.timestamp).toLocaleString('fr-FR', {
              day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
            })
          : null;

        return (
          <div key={`${step.status}-${index}`} className="flex gap-3">
            {/* Timeline line + icon */}
            <div className="flex flex-col items-center">
              <div className={cn(
                "w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center border-2 shrink-0 transition-all",
                step.reached
                  ? cn(colorMap[config.color], isCurrent && "ring-2 ring-offset-2 ring-offset-background ring-primary/30 scale-110")
                  : "bg-muted border-border text-muted-foreground"
              )}>
                <Icon className="h-3.5 w-3.5 md:h-4 md:w-4" />
              </div>
              {!isLast && (
                <div className={cn(
                  "w-0.5 h-8 md:h-10 my-1",
                  step.reached ? lineColorMap[config.color] : "bg-border"
                )} />
              )}
            </div>

            {/* Content */}
            <div className={cn("pt-1 pb-3 min-w-0", !step.reached && "opacity-40")}>
              <p className={cn(
                "font-medium text-sm",
                isCurrent ? "text-foreground" : step.reached ? "text-foreground/80" : "text-muted-foreground"
              )}>
                {config.label}
              </p>
              {step.reached && (
                <>
                  {step.entry?.note && (
                    <p className="text-xs text-muted-foreground mt-0.5">{step.entry.note}</p>
                  )}
                  {formattedTime && (
                    <p className="text-[10px] text-muted-foreground/60 mt-0.5">{formattedTime}</p>
                  )}
                </>
              )}
              {!step.reached && (
                <p className="text-xs text-muted-foreground mt-0.5">À venir</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
