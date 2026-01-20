"use client";

import { useEffect, useState } from "react";
import { client } from "@/lib/client";
import { getMe } from "@/lib/me";

export default function InviteAcceptPage({ params }: { params: { token: string } }) {
  const token = params.token;
  const [status, setStatus] = useState<"loading" | "invalid" | "accepted" | "ready">("loading");
  const [invite, setInvite] = useState<any>(null);

  async function load() {
    const res = await (client as any).models.Invite.list({ filter: { token: { eq: token } } });
    const inv = res?.data?.[0];
    if (!inv) { setStatus("invalid"); return; }
    setInvite(inv);
    if (inv.acceptedAt) { setStatus("accepted"); return; }
    if (inv.expiresAt && new Date(inv.expiresAt).getTime() < Date.now()) { setStatus("invalid"); return; }
    setStatus("ready");
  }

  async function accept() {
    const me = await getMe();

    await (client as any).models.Membership.create({
      workspaceId: invite.workspaceId,
      userSub: me.sub,
      email: me.email,
      role: invite.role
    });

    await (client as any).models.Invite.update({
      id: invite.id,
      acceptedAt: new Date().toISOString()
    });

    setStatus("accepted");
  }

  useEffect(() => { load(); }, []);

  return (
    <main style={{ padding: 24, display: "grid", gap: 12, maxWidth: 720 }}>
      <a href="/workspaces">← Workspaces</a>
      <h1>Accept Invite</h1>

      {status === "loading" ? <p>Loading…</p> : null}
      {status === "invalid" ? <p>Invite is invalid or expired.</p> : null}
      {status === "accepted" ? (
        <div>
          <p>Invite accepted ✅</p>
          <a href="/workspaces">Go to Workspaces</a>
        </div>
      ) : null}

      {status === "ready" ? (
        <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16 }}>
          <p>
            You were invited to workspace <strong>{invite.workspaceId}</strong> as <strong>{invite.role}</strong>.
          </p>
          <button onClick={accept} style={{ padding: 10, borderRadius: 10, border: "1px solid #333", cursor: "pointer" }}>
            Accept Invite
          </button>
        </div>
      ) : null}
    </main>
  );
}
