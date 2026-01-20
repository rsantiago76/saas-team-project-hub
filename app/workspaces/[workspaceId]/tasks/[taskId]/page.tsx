"use client";

import { useEffect, useState } from "react";
import { client } from "@/lib/client";
import { getMe } from "@/lib/me";

export default function TaskDetail({ params }: { params: { workspaceId: string; taskId: string } }) {
  const { workspaceId, taskId } = params;
  const [task, setTask] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [body, setBody] = useState("");

  async function load() {
    const t = await (client as any).models.Task.get({ id: taskId });
    setTask(t.data);
    const res = await (client as any).models.Comment.list({ filter: { taskId: { eq: taskId } } });
    setComments(res.data || []);
  }

  async function addComment() {
    const me = await getMe();
    if (!body.trim()) return;
    await (client as any).models.Comment.create({
      workspaceId,
      taskId,
      body: body.trim(),
      authorSub: me.sub
    });
    setBody("");
    await load();
  }

  useEffect(() => { load(); }, []);

  return (
    <main style={{ padding: 24, display: "grid", gap: 14, maxWidth: 860 }}>
      <a href={`/workspaces/${workspaceId}/projects`}>← Projects</a>
      <h1>{task?.title || "Task"}</h1>
      <p style={{ opacity: 0.8 }}>Status: <strong>{task?.status || "…"}</strong></p>

      <section style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16 }}>
        <h2 style={{ marginTop: 0 }}>Add Comment</h2>
        <textarea
          placeholder="Write a comment…"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          style={{ padding: 10, borderRadius: 10, border: "1px solid #ccc", width: "100%", minHeight: 90 }}
        />
        <button onClick={addComment} style={{ padding: 10, borderRadius: 10, border: "1px solid #333", cursor: "pointer", marginTop: 8 }}>
          Post
        </button>
      </section>

      <section style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16 }}>
        <h2 style={{ marginTop: 0 }}>Comments</h2>
        {comments.length === 0 ? <p>No comments yet.</p> : null}
        <ul style={{ paddingLeft: 18 }}>
          {comments.map((c) => (
            <li key={c.id} style={{ marginBottom: 10 }}>
              <div style={{ whiteSpace: "pre-wrap" }}>{c.body}</div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
