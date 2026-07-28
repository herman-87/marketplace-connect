import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/tax";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  ChevronLeft,
  ChevronRight,
  Download,
  Inbox,
  AlertTriangle,
} from "lucide-react";
import { wallets, type WalletTransaction } from "@/data/walletData";
import {
  fetchAccountTransactions,
  apiStatusLabels,
  apiTypeLabels,
  statusToApi,
  typeToApi,
  type TransactionPage,
} from "@/lib/walletApi";
import {
  TransactionFilters,
  defaultFilters,
  type TxFiltersState,
} from "@/components/wallet/TransactionFilters";
import { TransactionDetailSheet } from "@/components/wallet/TransactionDetailSheet";

const statusStyles = {
  SUCCESS: "bg-success/10 text-success",
  PENDING: "bg-muted text-muted-foreground",
  FAILED: "bg-destructive/10 text-destructive",
} as const;

const typeMeta = {
  DEPOSIT: { Icon: ArrowDownLeft, wrap: "bg-success/10 text-success" },
  WITHDRAWAL: { Icon: ArrowUpRight, wrap: "bg-destructive/10 text-destructive" },
  INTERNAL: { Icon: ArrowLeftRight, wrap: "bg-muted text-muted-foreground" },
} as const;

const pageSizes = [10, 20, 50, 100];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AccountTransactions() {
  const { accountId = "personal" } = useParams();
  const account = wallets.find((w) => w.id === accountId);

  const [filters, setFilters] = useState<TxFiltersState>(defaultFilters);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [data, setData] = useState<TransactionPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTx, setSelectedTx] = useState<WalletTransaction | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  // Filter changes reset to first page, but filters persist across page changes.
  useEffect(() => {
    setPage(0);
  }, [filters.status, filters.type, filters.field, filters.direction, filters.range, size]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchAccountTransactions(accountId, {
      page,
      size,
      field: filters.field,
      direction: filters.direction,
      status: filters.status,
      type: filters.type,
      start: filters.range?.from?.toISOString(),
      end: (filters.range?.to ?? filters.range?.from)?.toISOString(),
    })
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Erreur de chargement");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [accountId, page, size, filters.field, filters.direction, filters.status, filters.type, filters.range, reloadKey]);

  // Client-side quick search (UI only, not sent to the API)
  const rows = useMemo(() => {
    const list = data?.content ?? [];
    const q = filters.search.trim().toLowerCase();
    if (!q) return list;
    return list.filter((t) =>
      [t.reference, t.counterparty, t.id].some((v) => v?.toLowerCase().includes(q))
    );
  }, [data, filters.search]);

  const currency = account?.currency ?? "EUR";

  if (!account) {
    return (
      <AppLayout title="Transactions">
        <Card>
          <CardContent className="p-8 text-center text-sm text-muted-foreground">
            Compte introuvable.
          </CardContent>
        </Card>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Transactions" subtitle="Historique complet du compte sélectionné.">
      <div className="animate-fade-in space-y-4 md:space-y-5">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Button asChild variant="ghost" size="icon" className="h-9 w-9 shrink-0">
              <Link to="/wallet" aria-label="Retour au wallet">
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </Button>
            <div className="min-w-0">
              <h1 className="text-base md:text-lg font-medium text-foreground truncate">
                {account.name}
              </h1>
              <p className="text-xl md:text-2xl font-bold text-foreground">
                {formatPrice(account.balance, currency)}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            className="h-9 gap-1.5 text-xs"
            onClick={() => toast.success("Export des transactions lancé")}
          >
            <Download className="w-3.5 h-3.5" />
            Exporter
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-3 md:p-4">
            <TransactionFilters
              value={filters}
              onChange={setFilters}
              onReset={() => setFilters({ ...defaultFilters, search: filters.search })}
            />
          </CardContent>
        </Card>

        {/* List */}
        <Card>
          <CardContent className="p-0">
            {/* Desktop head */}
            <div className="hidden lg:grid grid-cols-[150px_1fr_140px_150px_130px_110px] gap-3 px-4 py-2.5 border-b border-border text-[11px] uppercase tracking-wide text-muted-foreground">
              <span>Date</span>
              <span>Contrepartie</span>
              <span>Référence</span>
              <span>Méthode</span>
              <span className="text-right">Montant</span>
              <span className="text-right">Statut</span>
            </div>

            {loading ? (
              <div className="divide-y divide-border">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 md:p-4">
                    <Skeleton className="w-9 h-9 rounded-full shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-3.5 w-1/3" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="p-10 text-center">
                <AlertTriangle className="w-8 h-8 text-destructive mx-auto mb-2" />
                <p className="text-sm font-medium text-foreground">Impossible de charger les transactions</p>
                <p className="text-xs text-muted-foreground mt-1">{error}</p>
                <Button className="mt-4 h-9" onClick={() => setReloadKey((k) => k + 1)}>
                  Réessayer
                </Button>
              </div>
            ) : rows.length === 0 ? (
              <div className="p-10 text-center">
                <Inbox className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm font-medium text-foreground">Aucune transaction trouvée</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Ajustez vos filtres ou votre recherche.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {rows.map((tx) => {
                  const apiType = typeToApi[tx.type];
                  const apiStatus = statusToApi[tx.status];
                  const { Icon, wrap } = typeMeta[apiType];
                  const incoming = tx.amount > 0;
                  return (
                    <button
                      key={tx.id}
                      type="button"
                      onClick={() => setSelectedTx(tx)}
                      className="w-full text-left hover:bg-muted/50 transition-colors px-3 md:px-4 py-3 lg:grid lg:grid-cols-[150px_1fr_140px_150px_130px_110px] lg:gap-3 lg:items-center flex items-center gap-3"
                    >
                      {/* Mobile icon */}
                      <span
                        className={cn(
                          "lg:hidden w-9 h-9 rounded-full flex items-center justify-center shrink-0",
                          wrap
                        )}
                      >
                        <Icon className="w-4 h-4" />
                      </span>

                      <span className="hidden lg:flex items-center gap-2 text-xs text-muted-foreground">
                        <span className={cn("w-7 h-7 rounded-full flex items-center justify-center", wrap)}>
                          <Icon className="w-3.5 h-3.5" />
                        </span>
                        {formatDate(tx.date)}
                      </span>

                      <span className="flex-1 min-w-0 lg:flex-none">
                        <span className="block text-sm font-medium text-foreground truncate">
                          {tx.counterparty ?? "—"}
                        </span>
                        <span className="block text-xs text-muted-foreground truncate">
                          <span className="lg:hidden">{formatDate(tx.date)} · </span>
                          {apiTypeLabels[apiType]}
                          <span className="lg:hidden"> · {tx.reference}</span>
                        </span>
                      </span>

                      <span className="hidden lg:block text-xs text-muted-foreground truncate">
                        {tx.reference ?? "—"}
                      </span>
                      <span className="hidden lg:block text-xs text-muted-foreground truncate">
                        {tx.method ?? "—"}
                      </span>

                      <span className="text-right shrink-0">
                        <span
                          className={cn(
                            "block text-sm font-semibold tabular-nums",
                            incoming ? "text-success" : "text-foreground"
                          )}
                        >
                          {incoming ? "+" : "−"}
                          {formatPrice(Math.abs(tx.amount), currency)}
                        </span>
                        <span
                          className={cn(
                            "lg:hidden inline-block mt-0.5 text-[10px] px-1.5 py-0.5 rounded-full",
                            statusStyles[apiStatus]
                          )}
                        >
                          {apiStatusLabels[apiStatus]}
                        </span>
                      </span>

                      <span className="hidden lg:flex justify-end">
                        <span
                          className={cn(
                            "text-[10px] px-2 py-0.5 rounded-full",
                            statusStyles[apiStatus]
                          )}
                        >
                          {apiStatusLabels[apiStatus]}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {data && !error && (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>
                {data.totalElements} transaction{data.totalElements > 1 ? "s" : ""} · page{" "}
                {data.page + 1} / {data.totalPages}
              </span>
              <Select value={String(size)} onValueChange={(v) => setSize(Number(v))}>
                <SelectTrigger className="h-8 w-[108px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  {pageSizes.map((s) => (
                    <SelectItem key={s} value={String(s)}>
                      {s} / page
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="h-8 text-xs gap-1"
                disabled={loading || data.page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Précédent
              </Button>
              <Button
                variant="outline"
                className="h-8 text-xs gap-1"
                disabled={loading || data.page >= data.totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
              >
                Suivant <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <TransactionDetailSheet
        tx={selectedTx}
        currency={currency}
        onOpenChange={(open) => !open && setSelectedTx(null)}
      />
    </AppLayout>
  );
}
