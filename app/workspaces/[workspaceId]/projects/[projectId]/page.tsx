"use client";

import { useEffect, useState } from "react";
import { client } from "@/lib/client";
import { getMe } from "@/lib/me";

type Status = "TODO" | "IN_PROGRESS" | "DONE";

export default function ProjectDetail({ params }: { params: { workspaceId: string; projectId: string } }) {
  const { workspaceId, projectId } = params;
  const [project, setProject] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<Status>("TODO");

  async function load() {
    const p = await (client as any).models.Project.get({ id: projectId });
    setProject(p.data);
    const res = await (client as any).models.Task.list({ filter: { projectId: { eq: projectId } } });
    setTasks(res.data || []);
  }

  async function createTask() {
    const me = await getMe();
    if (!title.trim()) return;
    await (client as any).models.Task.create({
      workspaceId,
      projectId,
      title: title.trim(),
      status,
      assignedToSub: null,
      createdBySub: me.sub
    });
    setTitle("");
    setStatus("TODO");
    await load();
  }

  useEffect(() => { load(); }, []);

  return (
    <main style={{ padding: 24, display: "grid", gap: 14 }}>
      <a href={`/workspaces/${workspaceId}/projects`}>← Projects</a>
      <h1>{project?.name || "Project"}</h1>

      <section style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16, maxWidth: 720 }}>
        <h2 style={{ marginTop: 0 }}>Create Task</h2>
        <input
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ padding: 10, borderRadius: 10, border: "1px solid #ccc", width: "100%" }}
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as any)}
          style={{ padding: 10, borderRadius: 10, border: "1px solid #ccc", marginTop: 8 }}
        >
          <option value="TODO">TODO</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="DONE">DONE</option>
        </select>
        <button onClick={createTask} style={{ padding: 10, borderRadius: 10, border: "1px solid #333", cursor: "pointer", marginTop: 8 }}>
          Create
        </button>
      </section>

      <section style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16 }}>
        <h2 style={{ marginTop: 0 }}>Tasks</h2>
        <ul style={{ paddingLeft: 18 }}>
          {tasks.map((t) => (
            <li key={t.id} style={{ marginBottom: 10 }}>
              <strong>{t.title}</strong> <span style={{ opacity: 0.75 }}>({t.status})</span>
              <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
                <a href={`/workspaces/${workspaceId}/tasks/${t.id}`}>Open</a>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
