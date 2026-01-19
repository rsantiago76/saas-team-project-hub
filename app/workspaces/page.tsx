"use client";

import { useEffect, useState } from "react";
import { client } from "@/lib/client";
import { getMe } from "@/lib/me";

export default function WorkspacesPage() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const me = await getMe();
    const mem = await client.models.Membership.list({
      filter: { userSub: { eq: me.sub } },
    });
    const ids = mem.data.map((m:any)=>m.workspaceId);
    const all = await client.models.Workspace.list();
    setWorkspaces(all.data.filter((w:any)=>ids.includes(w.id)));
    setLoading(false);
  }

  async function createWorkspace() {
    const me = await getMe();
    if (!name || !slug) return;
    const now = new Date().toISOString();

    const ws = await client.models.Workspace.create({
      name,
      slug,
      ownerSub: me.sub,
      createdAt: now,
      updatedAt: now,
    });

    await client.models.Membership.create({
      workspaceId: ws.data.id,
      userSub: me.sub,
      email: me.email,
      role: "OWNER",
      createdAt: now,
      updatedAt: now,
    });

    setName("");
    setSlug("");
    load();
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 26, fontWeight: 900 }}>Workspaces</h1>

      <div style={{ marginTop: 12, padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
        <h2>Create Workspace</h2>
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
        <button onClick={createWorkspace}>Create</button>
      </div>

      <h2 style={{ marginTop: 20 }}>Your Workspaces</h2>
      {loading ? <p>Loading…</p> : null}

      <ul>
        {workspaces.map((ws) => (
          <li key={ws.id}>
            <strong>{ws.name}</strong> — <code>{ws.slug}</code>
          </li>
        ))}
      </ul>
    </main>
  );
}
