"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { getFirebaseAuth } from "@/lib/firebase-client";
import type { Dictionary } from "@/lib/i18n";

interface Payment {
  id: string;
  uid: string;
  product: "military_ai_workout" | "member_pro";
  amountTotal: number | null;
  currency: string | null;
  renewal?: boolean;
  purchasedAt: string;
}

async function idToken() {
  return getFirebaseAuth().currentUser?.getIdToken();
}

function formatAmount(amount: number | null, currency: string | null) {
  if (amount === null || !currency) return "—";
  return new Intl.NumberFormat(undefined, { style: "currency", currency: currency.toUpperCase() }).format(amount / 100);
}

export function AdminPaymentsPanel({ dict }: { dict: Dictionary }) {
  const a = dict.admin;
  const [payments, setPayments] = useState<Payment[]>([]);
  const [revenueByCurrency, setRevenueByCurrency] = useState<Record<string, { allTime: number; thisMonth: number }>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const token = await idToken();
      const res = await fetch("/api/admin/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: token }),
      });
      const data = await res.json();
      setPayments(data.payments ?? []);
      setRevenueByCurrency(data.revenueByCurrency ?? {});
      setLoading(false);
    })();
  }, []);

  if (loading) return null;

  return (
    <div className="mt-6 space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase text-gold">{a.revenueTitle}</p>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {Object.entries(revenueByCurrency).map(([currency, rev]) => (
            <Card key={currency}>
              <p className="text-xs text-silver">{currency}</p>
              <p className="mt-1 font-heading text-2xl font-extrabold text-gold">{formatAmount(rev.thisMonth, currency)}</p>
              <p className="text-xs text-silver">{a.thisMonth}</p>
              <p className="mt-2 text-sm font-semibold text-white">{formatAmount(rev.allTime, currency)}</p>
              <p className="text-xs text-silver">{a.allTime}</p>
            </Card>
          ))}
          {Object.keys(revenueByCurrency).length === 0 && <p className="text-sm text-silver">—</p>}
        </div>
      </div>

      <div className="space-y-2">
        {payments.map((p) => (
          <Card key={p.id}>
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <span className="font-semibold text-white">{p.product === "military_ai_workout" ? "Tactical" : "Member Pro"}</span>
              <span className="text-silver">{p.uid.slice(0, 10)}…</span>
              <span className="font-semibold text-gold">{formatAmount(p.amountTotal, p.currency)}</span>
              {p.renewal && <span className="text-xs text-silver">↻</span>}
              <span className="text-xs text-silver">{new Date(p.purchasedAt).toLocaleDateString()}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
