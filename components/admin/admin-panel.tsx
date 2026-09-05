"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminContentPanel } from "./admin-content-panel";
import { useAuth } from "@/lib/auth-context";
import { getFirebaseAuth } from "@/lib/firebase-client";
import type { Dictionary } from "@/lib/i18n";
import type { UserRole, SupportedCountry } from "@/lib/types";

interface Stats {
  totalUsers: number;
  totalCoaches: number;
  totalGyms: number;
  activeMilitarySubs: number;
  activeMemberProSubs: number;
  militaryGenerations: number;
  copilotUsage: number;
  challengeParticipants: number;
}

interface AdminUser {
  id: string;
  email: string;
  displayName: string;
  roles: UserRole[];
  militaryAiSubscriptionStatus: string | null;
  memberProSubscriptionStatus: string | null;
}

const ALL_ROLES: UserRole[] = [
  "member", "coach", "gym_staff", "gym_manager", "gym_owner", "support", "platform_admin", "super_admin",
];
const COUNTRIES: SupportedCountry[] = ["BR", "PT", "ES", "US"];
const CURRENCY_LABEL: Record<SupportedCountry, string> = { BR: "R$", PT: "€", ES: "€", US: "$" };

async function idToken() {
  return getFirebaseAuth().currentUser?.getIdToken();
}

export function AdminPanel({ dict }: { dict: Dictionary }) {
  const a = dict.admin;
  const { user } = useAuth();
  const [tab, setTab] = useState<"stats" | "users" | "pricing" | "content">("stats");

  const [bootstrapping, setBootstrapping] = useState(false);
  const [bootstrapDone, setBootstrapDone] = useState(false);
  const [bootstrapError, setBootstrapError] = useState<string | null>(null);

  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [pricing, setPricing] = useState<{ military: Record<string, string>; memberPro: Record<string, string> }>({
    military: {}, memberPro: {},
  });
  const [amounts, setAmounts] = useState<Record<string, string>>({});
  const [amountStatus, setAmountStatus] = useState<Record<string, "idle" | "saving" | "saved" | "error">>({});
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);

  async function loadAll() {
    const token = await idToken();
    if (!token) return;
    const [statsRes, usersRes, pricingRes] = await Promise.all([
      fetch("/api/admin/stats", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ idToken: token }) }),
      fetch("/api/admin/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ idToken: token }) }),
      fetch("/api/admin/pricing", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ idToken: token }) }),
    ]);
    if (statsRes.status === 403) {
      setForbidden(true);
      setLoading(false);
      return;
    }
    setStats(await statsRes.json());
    const usersData = await usersRes.json();
    setUsers(usersData.users ?? []);
    const pricingData = await pricingRes.json();
    setPricing({
      military: pricingData.config?.military ?? {},
      memberPro: pricingData.config?.memberPro ?? {},
    });
    setLoading(false);
  }

  useEffect(() => {
    if (user) loadAll();
    else setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function handleBootstrap() {
    setBootstrapping(true);
    setBootstrapError(null);
    try {
      const token = await idToken();
      const res = await fetch("/api/admin/bootstrap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: token }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "failed");
      await user?.getIdToken(true);
      setBootstrapDone(true);
    } catch (err) {
      setBootstrapError(err instanceof Error ? err.message : "failed");
    } finally {
      setBootstrapping(false);
    }
  }

  async function toggleRole(targetUser: AdminUser, role: UserRole) {
    const nextRoles = targetUser.roles.includes(role)
      ? targetUser.roles.filter((r) => r !== role)
      : [...targetUser.roles, role];
    const token = await idToken();
    await fetch("/api/admin/users/set-roles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken: token, targetUserId: targetUser.id, roles: nextRoles }),
    });
    setUsers((prev) => prev.map((u) => (u.id === targetUser.id ? { ...u, roles: nextRoles } : u)));
  }

  async function handleSavePricing() {
    const token = await idToken();
    await fetch("/api/admin/pricing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken: token, action: "save", config: pricing }),
    });
  }

  async function handleUpdateAmount(product: "military" | "memberPro", country: SupportedCountry) {
    const key = `${product}_${country}`;
    const amount = Number(amounts[key]);
    if (!amount || amount <= 0) return;
    setAmountStatus((prev) => ({ ...prev, [key]: "saving" }));
    try {
      const token = await idToken();
      const res = await fetch("/api/admin/pricing/update-amount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: token, product, country, amount }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "failed");
      setPricing((prev) => ({ ...prev, [product]: { ...prev[product], [country]: data.newPriceId } }));
      setAmountStatus((prev) => ({ ...prev, [key]: "saved" }));
    } catch (err) {
      console.error("[AdminPanel] update amount failed:", err);
      setAmountStatus((prev) => ({ ...prev, [key]: "error" }));
    }
  }

  if (loading) return null;

  if (forbidden) {
    if (bootstrapDone) {
      return <Card className="mx-auto max-w-lg text-center"><p className="text-emerald-400">{a.bootstrapDone}</p></Card>;
    }
    return (
      <Card className="mx-auto max-w-lg text-center">
        <h2 className="font-heading text-xl font-bold">{a.bootstrapTitle}</h2>
        <p className="mt-3 text-sm text-silver">{a.bootstrapSubtitle}</p>
        {bootstrapError && <p className="mt-3 text-sm text-red-400">{bootstrapError}</p>}
        <Button variant="primary" size="lg" onClick={handleBootstrap} disabled={bootstrapping} className="mt-6 w-full">
          {a.bootstrapCta}
        </Button>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-[112rem]">
      <div className="flex gap-2">
        {(["stats", "users", "pricing", "content"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full border px-4 py-2 text-sm font-semibold ${
              tab === t ? "border-gold bg-gold text-carbon" : "border-white/15 text-white"
            }`}
          >
            {t === "stats" ? a.stats.title : t === "users" ? a.users.title : t === "pricing" ? a.pricing.title : a.content.title}
          </button>
        ))}
      </div>

      {tab === "stats" && stats && (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {([
            [a.stats.totalUsers, stats.totalUsers],
            [a.stats.totalCoaches, stats.totalCoaches],
            [a.stats.totalGyms, stats.totalGyms],
            [a.stats.activeMilitarySubs, stats.activeMilitarySubs],
            [a.stats.activeMemberProSubs, stats.activeMemberProSubs],
            [a.stats.militaryGenerations, stats.militaryGenerations],
            [a.stats.copilotUsage, stats.copilotUsage],
            [a.stats.challengeParticipants, stats.challengeParticipants],
          ] as const).map(([label, value]) => (
            <Card key={label}>
              <p className="text-xs text-silver">{label}</p>
              <p className="mt-2 font-heading text-3xl font-extrabold text-gold">{value}</p>
            </Card>
          ))}
        </div>
      )}

      {tab === "users" && (
        <div className="mt-6 space-y-3">
          {users.map((u) => (
            <Card key={u.id}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-white">{u.displayName || u.email || u.id.slice(0, 10)}</p>
                  <p className="text-xs text-silver">{u.email}</p>
                </div>
                <div className="flex gap-2 text-xs text-silver">
                  {u.militaryAiSubscriptionStatus === "active" && <span className="text-gold">Tactical</span>}
                  {u.memberProSubscriptionStatus === "active" && <span className="text-gold">Member Pro</span>}
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {ALL_ROLES.map((role) => (
                  <button
                    key={role}
                    onClick={() => toggleRole(u, role)}
                    className={`rounded-full border px-2.5 py-1 text-xs ${
                      u.roles.includes(role) ? "border-gold bg-gold text-carbon" : "border-white/15 text-silver"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === "pricing" && (
        <Card className="mt-6">
          <p className="text-sm text-silver">{a.pricing.subtitle}</p>
          <p className="mt-2 text-xs text-gold">{a.pricing.realAmountNote}</p>

          {(["military", "memberPro"] as const).map((product) => (
            <div key={product} className="mt-6">
              <p className="text-xs font-semibold uppercase text-gold">{product}</p>
              <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {COUNTRIES.map((country) => {
                  const key = `${product}_${country}`;
                  const status = amountStatus[key] ?? "idle";
                  return (
                    <div key={country} className="rounded-lg border border-white/10 p-3">
                      <label className="text-xs text-silver">{country}</label>

                      <div className="mt-2 flex gap-2">
                        <div className="flex items-center rounded-md border border-white/10 bg-carbon px-3 text-sm text-silver">
                          {CURRENCY_LABEL[country]}
                        </div>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder={a.pricing.newAmountPlaceholder}
                          value={amounts[key] ?? ""}
                          onChange={(e) => setAmounts((prev) => ({ ...prev, [key]: e.target.value }))}
                        />
                        <Button variant="primary" size="sm" onClick={() => handleUpdateAmount(product, country)}>
                          {status === "saving" ? "..." : a.pricing.updateAmount}
                        </Button>
                      </div>
                      {status === "saved" && <p className="mt-1 text-xs text-emerald-400">{a.pricing.amountUpdated}</p>}
                      {status === "error" && <p className="mt-1 text-xs text-red-400">{a.pricing.amountError}</p>}

                      <details className="mt-3">
                        <summary className="cursor-pointer text-xs text-silver/60">{a.pricing.advancedLabel}</summary>
                        <label className="mt-2 block text-xs text-silver">{a.pricing.priceId}</label>
                        <Input
                          value={pricing[product][country] ?? ""}
                          onChange={(e) =>
                            setPricing((prev) => ({ ...prev, [product]: { ...prev[product], [country]: e.target.value } }))
                          }
                          placeholder="price_..."
                          className="mt-1"
                        />
                      </details>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          <Button variant="secondary" size="md" onClick={handleSavePricing} className="mt-6 w-full">
            {a.pricing.save}
          </Button>
        </Card>
      )}
      {tab === "content" && <AdminContentPanel dict={dict} />}
    </div>
  );
}
