"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { getFirebaseAuth } from "@/lib/firebase-client";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export function AdminMessagesPanel() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const idToken = await getFirebaseAuth().currentUser?.getIdToken();
      const res = await fetch("/api/admin/contact-messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      const data = await res.json();
      setMessages(data.messages ?? []);
      setLoading(false);
    })();
  }, []);

  if (loading) return null;

  if (messages.length === 0) {
    return <p className="mt-6 text-center text-silver">Nenhuma mensagem ainda.</p>;
  }

  return (
    <div className="mt-6 space-y-3">
      {messages.map((m) => (
        <Card key={m.id}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold text-white">
              {m.name} <span className="text-xs font-normal text-silver">— {m.email}</span>
            </p>
            <p className="text-xs text-silver">{new Date(m.createdAt).toLocaleString()}</p>
          </div>
          <p className="mt-2 text-sm text-silver">{m.message}</p>
        </Card>
      ))}
    </div>
  );
}
