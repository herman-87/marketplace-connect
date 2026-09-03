import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  AdminAccount,
  AdminBusiness,
  AdminContentItem,
  ContentStatus,
  ModerationLogEntry,
  PlatformUser,
  PromoCode,
  seedAdmins,
  seedBusinesses,
  seedContent,
  seedModerationLog,
  seedPromoCodes,
  seedUsers,
} from "@/data/adminData";

const KEYS = {
  session: "fr_admin_session",
  admins: "fr_admin_accounts",
  users: "fr_admin_platform_users",
  businesses: "fr_admin_businesses",
  content: "fr_admin_content",
  promos: "fr_admin_promo_codes",
  log: "fr_admin_moderation_log",
};



function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

interface AdminAuthContextValue {
  admin: AdminAccount | null;
  admins: AdminAccount[];
  users: PlatformUser[];
  businesses: AdminBusiness[];
  content: AdminContentItem[];
  promoCodes: PromoCode[];
  signIn: (email: string, password: string) => { error: string | null };
  signOut: () => void;
  createAdmin: (data: Omit<AdminAccount, "id" | "createdAt" | "active">) => void;
  toggleAdmin: (id: string) => void;
  createUser: (data: Omit<PlatformUser, "id" | "createdAt">) => void;
  updateUser: (id: string, patch: Partial<PlatformUser>) => void;
  deleteUser: (id: string) => void;
  updateBusiness: (id: string, patch: Partial<AdminBusiness>) => void;
  updateContent: (id: string, patch: Partial<AdminContentItem>) => void;
  deleteContent: (id: string) => void;
  moderationLog: ModerationLogEntry[];
  moderateContent: (ids: string[], status: ContentStatus, reason?: string) => void;
  dismissReports: (ids: string[]) => void;
  addModerationNote: (id: string, note: string) => void;
  createPromoCode: (data: Omit<PromoCode, "id" | "createdAt" | "usageCount">) => void;
  updatePromoCode: (id: string, patch: Partial<PromoCode>) => void;
  deletePromoCode: (id: string) => void;
}


const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined);

const today = () => new Date().toISOString().slice(0, 10);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admins, setAdmins] = useState<AdminAccount[]>(() => load(KEYS.admins, seedAdmins));
  const [admin, setAdmin] = useState<AdminAccount | null>(() => load<AdminAccount | null>(KEYS.session, null));
  const [users, setUsers] = useState<PlatformUser[]>(() => load(KEYS.users, seedUsers));
  const [businesses, setBusinesses] = useState<AdminBusiness[]>(() => load(KEYS.businesses, seedBusinesses));
  const [content, setContent] = useState<AdminContentItem[]>(() => load(KEYS.content, seedContent));
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(() => load(KEYS.promos, seedPromoCodes));
  const [moderationLog, setModerationLog] = useState<ModerationLogEntry[]>(() => load(KEYS.log, seedModerationLog));

  useEffect(() => save(KEYS.admins, admins), [admins]);
  useEffect(() => save(KEYS.session, admin), [admin]);
  useEffect(() => save(KEYS.users, users), [users]);
  useEffect(() => save(KEYS.businesses, businesses), [businesses]);
  useEffect(() => save(KEYS.content, content), [content]);
  useEffect(() => save(KEYS.promos, promoCodes), [promoCodes]);
  useEffect(() => save(KEYS.log, moderationLog), [moderationLog]);


  const signIn = useCallback(
    (email: string, password: string) => {
      const found = admins.find(
        (a) => a.email.toLowerCase() === email.trim().toLowerCase() && a.password === password,
      );
      if (!found) return { error: "Identifiants administrateur invalides." };
      if (!found.active) return { error: "Ce compte administrateur est désactivé." };
      setAdmin(found);
      return { error: null };
    },
    [admins],
  );

  const value = useMemo<AdminAuthContextValue>(
    () => ({
      admin,
      admins,
      users,
      businesses,
      content,
      promoCodes,
      signIn,
      signOut: () => setAdmin(null),
      createAdmin: (data) =>
        setAdmins((prev) => [
          ...prev,
          { ...data, id: `adm-${Date.now()}`, active: true, createdAt: today() },
        ]),
      toggleAdmin: (id) =>
        setAdmins((prev) => prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a))),
      createUser: (data) =>
        setUsers((prev) => [{ ...data, id: `usr-${Date.now()}`, createdAt: today() }, ...prev]),
      updateUser: (id, patch) =>
        setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...patch } : u))),
      deleteUser: (id) => setUsers((prev) => prev.filter((u) => u.id !== id)),
      updateBusiness: (id, patch) =>
        setBusinesses((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b))),
      updateContent: (id, patch) =>
        setContent((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c))),
      deleteContent: (id) => setContent((prev) => prev.filter((c) => c.id !== id)),
      moderationLog,
      moderateContent: (ids, status, reason) => {
        const stamp = now();
        setContent((prev) =>
          prev.map((c) =>
            ids.includes(c.id)
              ? {
                  ...c,
                  status,
                  reports: status === "published" ? 0 : c.reports,
                  reportDetails: status === "published" ? [] : c.reportDetails,
                  rejectionReason: status === "rejected" || status === "hidden" ? reason : undefined,
                  reviewedBy: admin?.name,
                  reviewedAt: stamp,
                }
              : c,
          ),
        );
        setModerationLog((prev) => [
          ...ids.map((id) => ({
            id: `mlog-${id}-${Date.now()}`,
            contentId: id,
            contentTitle: content.find((c) => c.id === id)?.title ?? id,
            action: statusActionLabels[status],
            reason,
            admin: admin?.name ?? "Système",
            at: stamp,
          })),
          ...prev,
        ]);
      },
      dismissReports: (ids) => {
        const stamp = now();
        setContent((prev) =>
          prev.map((c) => (ids.includes(c.id) ? { ...c, reports: 0, reportDetails: [] } : c)),
        );
        setModerationLog((prev) => [
          ...ids.map((id) => ({
            id: `mlog-dis-${id}-${Date.now()}`,
            contentId: id,
            contentTitle: content.find((c) => c.id === id)?.title ?? id,
            action: "Signalements ignorés",
            admin: admin?.name ?? "Système",
            at: stamp,
          })),
          ...prev,
        ]);
      },
      addModerationNote: (id, note) =>
        setContent((prev) => prev.map((c) => (c.id === id ? { ...c, moderationNote: note } : c))),
      createPromoCode: (data) =>
        setPromoCodes((prev) => [
          { ...data, id: `prm-${Date.now()}`, usageCount: 0, createdAt: today() },
          ...prev,
        ]),
      updatePromoCode: (id, patch) =>
        setPromoCodes((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p))),
      deletePromoCode: (id) => setPromoCodes((prev) => prev.filter((p) => p.id !== id)),
    }),
    [admin, admins, users, businesses, content, promoCodes, moderationLog, signIn],

  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  return ctx;
};
