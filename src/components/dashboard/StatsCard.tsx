import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  gradient?: boolean;
}

export function StatsCard({
  title,
  value,
  icon,
  trend,
  className,
  gradient = false,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl p-6 transition-all duration-300 card-hover",
        gradient
          ? "gradient-primary text-primary-foreground"
          : "bg-card border border-border",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p
            className={cn(
              "text-sm font-medium",
              gradient ? "text-primary-foreground/80" : "text-muted-foreground"
            )}
          >
            {title}
          </p>
          <p className="text-3xl font-bold">{value}</p>
          {trend && (
            <div
              className={cn(
                "flex items-center gap-1 text-sm",
                gradient
                  ? "text-primary-foreground/90"
                  : trend.isPositive
                  ? "text-success"
                  : "text-destructive"
              )}
            >
              {trend.isPositive ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span>{trend.isPositive ? "+" : ""}{trend.value}%</span>
              <span className={gradient ? "text-primary-foreground/70" : "text-muted-foreground"}>
                vs mois dernier
              </span>
            </div>
          )}
        </div>
        <div
          className={cn(
            "p-3 rounded-lg",
            gradient ? "bg-white/20" : "bg-primary/10"
          )}
        >
          {icon}
        </div>
      </div>

      {/* Decorative element */}
      {gradient && (
        <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-white/10" />
      )}
    </div>
  );
}
