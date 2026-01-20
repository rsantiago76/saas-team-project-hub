"use client";

import { useEffect, useState } from "react";
import { client } from "@/lib/client";
import { getMe } from "@/lib/me";

type Role = "OWNER" | "ADMIN" | "MEMBER";
type InviteRole = "ADMIN" | "MEMBER";

function randomToken() {
  return Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export default function MembersPage({ params }: { params: { workspaceId: string } }) {
  const workspaceId = params.workspaceId;
  const [members, setMembers] = useState<any[]>([]);
  const [workspace, setWorkspace] = useState<any>(null);
  const [myRole, setMyRole] = useState<Role | null>(null);

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<InviteRole>("MEMBER");
  const [inviteLink, setInviteLink] = useState<string | null>(null);

  async function load() {
    const me = await getMe();
    const wsRes = await (client as any).models.Workspace.get({ id: workspaceId });
    setWorkspace(wsRes.data);

    const memRes = await (client as any).models.Membership.list({ filter: { workspaceId: { eq: workspaceId } } });
    setMembers(memRes.data || []);
    const mine = (memRes.data || []).find((m: any) => m.userSub === me.sub);
    setMyRole(mine?.role || null);
  }

  async function createInvite() {
    if (!(myRole === "OWNER" || myRole === "ADMIN")) {
      alert("Only OWNER/ADMIN can invite.");
      return;
    }
    const email = inviteEmail.trim().toLowerCase();
    if (!email) return;

    const me = await getMe();
    const token = randomToken();
    const expires = new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString();

    await (client as any).models.Invite.create({
      workspaceId,
      email,
      role: inviteRole,
      token,
      invitedBySub: me.sub,
      acceptedAt: null,
      expiresAt: expires
    });

    const origin = window.location.origin;
    setInviteLink(`${origin}/invite/${token}`);
    setInviteEmail("");
    await load();
  }

  useEffect(() => { load(); }, []);

  return (
    <main style={{ padding: 24, display: "grid", gap: 14 }}>
      <a href="/workspaces">← Workspaces</a>

      <header>
        <h1 style={{ margin: 0 }}>Members & Invites</h1>
        <p style={{ margin: "6px 0 0 0", opacity: 0.8 }}>
          Workspace: <strong>{workspace?.name || "…"}</strong>
        </p>
      </header>

      <section style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16 }}>
        <h2 style={{ marginTop: 0 }}>Invite (copy link)</h2>
        <div style={{ display: "grid", gap: 8, maxWidth: 520 }}>
          <input
            placeholder="email@example.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            style={{ padding: 10, borderRadius: 10, border: "1px solid #ccc" }}
          />
          <select
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value as any)}
            style={{ padding: 10, borderRadius: 10, border: "1px solid #ccc" }}
          >
            <option value="MEMBER">MEMBER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
          <button
            onClick={createInvite}
            style={{ padding: 10, borderRadius: 10, border: "1px solid #333", cursor: "pointer" }}
          >
            Create Invite
          </button>
          {inviteLink ? (
            <div style={{ padding: 10, borderRadius: 10, border: "1px dashed #999" }}>
              <div style={{ fontSize: 12, opacity: 0.8 }}>Invite Link</div>
              <code style={{ wordBreak: "break-all" }}>{inviteLink}</code>
            </div>
          ) : null}
        </div>
      </section>

      <section style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16 }}>
        <h2 style={{ marginTop: 0 }}>Members</h2>
        <ul style={{ paddingLeft: 18 }}>
          {members.map((m) => (
            <li key={m.id}>
              {m.email} — <strong>{m.role}</strong>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
