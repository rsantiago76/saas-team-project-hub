"use client";

import { useEffect, useState } from "react";
import { client } from "@/lib/client";
import { getMe } from "@/lib/me";

export default function ProjectsPage({ params }: { params: { workspaceId: string } }) {
  const workspaceId = params.workspaceId;
  const [projects, setProjects] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  async function load() {
    const res = await (client as any).models.Project.list({ filter: { workspaceId: { eq: workspaceId } } });
    setProjects(res.data || []);
  }

  async function create() {
    const me = await getMe();
    if (!name.trim()) return;
    await (client as any).models.Project.create({
      workspaceId,
      name: name.trim(),
      description: desc.trim() || null,
      createdBySub: me.sub
    });
    setName(""); setDesc("");
    await load();
  }

  useEffect(() => { load(); }, []);

  return (
    <main style={{ padding: 24, display: "grid", gap: 14 }}>
      <a href="/workspaces">← Workspaces</a>
      <h1>Projects</h1>

      <section style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16, maxWidth: 720 }}>
        <h2 style={{ marginTop: 0 }}>Create Project</h2>
        <input
          placeholder="Project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: 10, borderRadius: 10, border: "1px solid #ccc", width: "100%" }}
        />
        <textarea
          placeholder="Description (optional)"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          style={{ padding: 10, borderRadius: 10, border: "1px solid #ccc", width: "100%", marginTop: 8 }}
        />
        <button onClick={create} style={{ padding: 10, borderRadius: 10, border: "1px solid #333", cursor: "pointer", marginTop: 8 }}>
          Create
        </button>
      </section>

      <section style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16 }}>
        <h2 style={{ marginTop: 0 }}>Project List</h2>
        <ul style={{ paddingLeft: 18 }}>
          {projects.map((p) => (
            <li key={p.id} style={{ marginBottom: 10 }}>
              <strong>{p.name}</strong>
              <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
                <a href={`/workspaces/${workspaceId}/projects/${p.id}`}>Open</a>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
