"use client";

import { useEffect, useState } from "react";
import { client } from "@/lib/client";
import { getMe } from "@/lib/me";
import { slugify } from "@/lib/utils";

type Role = "OWNER" | "ADMIN" | "MEMBER";

export default function WorkspacesPage() {
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [membership, setMembership] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<{ sub: string; email: string } | null>(null);
  const [displayName, setDisplayName] = useState("");

  async function ensureProfile(current: { sub: string; email: string }) {
    const profiles = await (client as any).models.UserProfile.list({ filter: { userSub: { eq: current.sub } } });
    if (profiles?.data?.length) {
      setDisplayName(profiles.data[0].displayName);
      return;
    }
    const defaultName = (current.email || "user").split("@")[0];
    await (client as any).models.UserProfile.create({
      userSub: current.sub,
      email: current.email,
      displayName: defaultName
    });
    setDisplayName(defaultName);
  }

  async function load() {
    setLoading(true);
    const current = await getMe();
    setMe(current);
    await ensureProfile(current);

    const mem = await (client as any).models.Membership.list({ filter: { userSub: { eq: current.sub } } });
    setMembership(mem.data || []);

    const allWs = await (client as any).models.Workspace.list();
    setWorkspaces(allWs.data || []);
    setLoading(false);
  }

  async function createWorkspace() {
    if (!me) return;
    const wsName = name.trim();
    const wsSlug = slugify(slug || wsName);
    if (!wsName || !wsSlug) return;

    const ws = await (client as any).models.Workspace.create({
      name: wsName,
      slug: wsSlug,
      ownerSub: me.sub
    });

    await (client as any).models.Membership.create({
      workspaceId: ws.data.id,
      userSub: me.sub,
      email: me.email,
      role: "OWNER" as Role
    });

    setName("");
    setSlug("");
    await load();
  }

  const myWorkspaceIds = new Set((membership || []).map((m) => m.workspaceId));
  const myWorkspaces = (workspaces || []).filter((w) => myWorkspaceIds.has(w.id));

  function myRole(workspaceId: string): Role | null {
    const m = (membership || []).find((x) => x.workspaceId === workspaceId);
    return (m?.role as Role) || null;
  }

  useEffect(() => { load(); }, []);

  return (
    <main style={{ padding: 24, display: "grid", gap: 16 }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div>
          <h1 style={{ margin: 0 }}>Workspaces</h1>
          <p style={{ margin: "6px 0 0 0", opacity: 0.8 }}>
            Signed in as <strong>{displayName || me?.email || "…"}</strong>
          </p>
        </div>
        <a href="/profile">Edit Profile</a>
      </header>

      <section style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16 }}>
        <h2 style={{ marginTop: 0 }}>Create Workspace</h2>
        <div style={{ display: "grid", gap: 8, maxWidth: 520 }}>
          <input
            placeholder="Workspace name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ padding: 10, borderRadius: 10, border: "1px solid #ccc" }}
          />
          <input
            placeholder="Slug (optional)"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            style={{ padding: 10, borderRadius: 10, border: "1px solid #ccc" }}
          />
          <button
            onClick={createWorkspace}
            style={{ padding: 10, borderRadius: 10, border: "1px solid #333", cursor: "pointer" }}
          >
            Create (You become OWNER)
          </button>
        </div>
      </section>

      <section style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16 }}>
        <h2 style={{ marginTop: 0 }}>Your Workspaces</h2>
        {loading ? <p>Loading…</p> : null}

        {myWorkspaces.length === 0 ? (
          <p>No workspaces yet. Create one above.</p>
        ) : (
          <ul style={{ paddingLeft: 18 }}>
            {myWorkspaces.map((ws) => (
              <li key={ws.id} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <strong>{ws.name}</strong>
                  <code>{ws.slug}</code>
                  <span style={{ opacity: 0.8 }}>({myRole(ws.id)})</span>
                </div>
                <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
                  <a href={`/workspaces/${ws.id}/projects`}>Projects</a>
                  <a href={`/workspaces/${ws.id}/settings/members`}>Members & Invites</a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
