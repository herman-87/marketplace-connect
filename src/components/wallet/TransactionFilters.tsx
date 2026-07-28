import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { DateRange } from "react-day-picker";
import { CalendarIcon, Search, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ApiStatus, ApiType, SortDirection, SortField } from "@/lib/walletApi";

export interface TxFiltersState {
  range?: DateRange;
  status?: ApiStatus;
  type?: ApiType;
  field: SortField;
  direction: SortDirection;
  search: string;
}

export const defaultFilters: TxFiltersState = {
  range: undefined,
  status: undefined,
  type: undefined,
  field: "DATE",
  direction: "DESC",
  search: "",
};

const ALL = "ALL";

const presets = [
  {
    id: "today",
    label: "Aujourd'hui",
    build: () => {
      const d = new Date();
      return { from: d, to: d } as DateRange;
    },
  },
  {
    id: "week",
    label: "Cette semaine",
    build: () => {
      const to = new Date();
      const from = new Date();
      from.setDate(to.getDate() - to.getDay() + 1);
      return { from, to } as DateRange;
    },
  },
  {
    id: "month",
    label: "Ce mois",
    build: () => {
      const to = new Date();
      const from = new Date(to.getFullYear(), to.getMonth(), 1);
      return { from, to } as DateRange;
    },
  },
];

const sortOptions: { value: string; label: string; field: SortField; direction: SortDirection }[] = [
  { value: "DATE:DESC", label: "Plus récentes", field: "DATE", direction: "DESC" },
  { value: "DATE:ASC", label: "Plus anciennes", field: "DATE", direction: "ASC" },
  { value: "AMOUNT:DESC", label: "Montant décroissant", field: "AMOUNT", direction: "DESC" },
  { value: "AMOUNT:ASC", label: "Montant croissant", field: "AMOUNT", direction: "ASC" },
];

interface Props {
  value: TxFiltersState;
  onChange: (next: TxFiltersState) => void;
  onReset: () => void;
}

export function TransactionFilters({ value, onChange, onReset }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeCount =
    (value.range?.from ? 1 : 0) + (value.status ? 1 : 0) + (value.type ? 1 : 0);

  const rangeLabel = value.range?.from
    ? value.range.to && value.range.to.getTime() !== value.range.from.getTime()
      ? `${format(value.range.from, "d MMM", { locale: fr })} – ${format(value.range.to, "d MMM", { locale: fr })}`
      : format(value.range.from, "d MMM yyyy", { locale: fr })
    : "Période";

  const controls = (
    <div className="flex flex-col md:flex-row md:flex-wrap md:items-center gap-2">
      {/* Date range */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "h-9 justify-start gap-2 text-xs font-normal md:w-auto",
              !value.range?.from && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            {rangeLabel}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex flex-wrap gap-1 p-2 border-b border-border">
            {presets.map((p) => (
              <Button
                key={p.id}
                size="sm"
                variant="ghost"
                className="h-7 text-xs"
                onClick={() => onChange({ ...value, range: p.build() })}
              >
                {p.label}
              </Button>
            ))}
            {value.range?.from && (
              <Button
                size="sm"
                variant="ghost"
                className="h-7 text-xs text-muted-foreground"
                onClick={() => onChange({ ...value, range: undefined })}
              >
                Effacer
              </Button>
            )}
          </div>
          <Calendar
            mode="range"
            selected={value.range}
            onSelect={(range) => onChange({ ...value, range })}
            numberOfMonths={1}
            initialFocus
            className={cn("p-3 pointer-events-auto")}
          />
        </PopoverContent>
      </Popover>

      {/* Status */}
      <Select
        value={value.status ?? ALL}
        onValueChange={(v) => onChange({ ...value, status: v === ALL ? undefined : (v as ApiStatus) })}
      >
        <SelectTrigger className="h-9 text-xs md:w-[150px]">
          <SelectValue placeholder="Statut" />
        </SelectTrigger>
        <SelectContent className="bg-popover z-50">
          <SelectItem value={ALL}>Tous les statuts</SelectItem>
          <SelectItem value="PENDING">Pending</SelectItem>
          <SelectItem value="SUCCESS">Completed</SelectItem>
          <SelectItem value="FAILED">Failed</SelectItem>
        </SelectContent>
      </Select>

      {/* Type */}
      <Select
        value={value.type ?? ALL}
        onValueChange={(v) => onChange({ ...value, type: v === ALL ? undefined : (v as ApiType) })}
      >
        <SelectTrigger className="h-9 text-xs md:w-[170px]">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent className="bg-popover z-50">
          <SelectItem value={ALL}>Tous les types</SelectItem>
          <SelectItem value="DEPOSIT">Deposit</SelectItem>
          <SelectItem value="WITHDRAWAL">Withdrawal</SelectItem>
          <SelectItem value="INTERNAL">Internal Transfer</SelectItem>
        </SelectContent>
      </Select>

      {/* Sort */}
      <Select
        value={`${value.field}:${value.direction}`}
        onValueChange={(v) => {
          const opt = sortOptions.find((o) => o.value === v);
          if (opt) onChange({ ...value, field: opt.field, direction: opt.direction });
        }}
      >
        <SelectTrigger className="h-9 text-xs md:w-[180px]">
          <SelectValue placeholder="Trier" />
        </SelectTrigger>
        <SelectContent className="bg-popover z-50">
          {sortOptions.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {activeCount > 0 && (
        <Button variant="ghost" className="h-9 text-xs gap-1.5" onClick={onReset}>
          <X className="w-3.5 h-3.5" />
          Réinitialiser
        </Button>
      )}
    </div>
  );

  return (
    <div className="space-y-2">
      {/* Search — always visible */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={value.search}
            onChange={(e) => onChange({ ...value, search: e.target.value })}
            placeholder="Rechercher une référence, contrepartie ou ID…"
            className="h-9 pl-9 text-sm"
          />
        </div>
        <Button
          variant="outline"
          className="h-9 gap-1.5 text-xs md:hidden"
          onClick={() => setMobileOpen((o) => !o)}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Filtres
          {activeCount > 0 && (
            <span className="ml-0.5 rounded-full bg-primary text-primary-foreground text-[10px] px-1.5">
              {activeCount}
            </span>
          )}
        </Button>
      </div>

      <div className="hidden md:block">{controls}</div>
      {mobileOpen && (
        <div className="md:hidden rounded-lg border border-border p-3 animate-fade-in">{controls}</div>
      )}
    </div>
  );
}
