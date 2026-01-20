"use client";

import { useEffect, useState } from "react";
import { client } from "@/lib/client";
import { getMe } from "@/lib/me";

export default function ProfilePage() {
  const [displayName, setDisplayName] = useState("");
  const [profileId, setProfileId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    const me = await getMe();
    const res = await (client as any).models.UserProfile.list({ filter: { userSub: { eq: me.sub } } });
    if (res?.data?.length) {
      setProfileId(res.data[0].id);
      setDisplayName(res.data[0].displayName);
    } else {
      const defaultName = (me.email || "user").split("@")[0];
      const created = await (client as any).models.UserProfile.create({
        userSub: me.sub,
        email: me.email,
        displayName: defaultName
      });
      setProfileId(created.data.id);
      setDisplayName(defaultName);
    }
  }

  async function save() {
    if (!profileId) return;
    setSaving(true);
    await (client as any).models.UserProfile.update({
      id: profileId,
      displayName: displayName.trim() || "user"
    });
    setSaving(false);
  }

  useEffect(() => { load(); }, []);

  return (
    <main style={{ padding: 24, display: "grid", gap: 12, maxWidth: 520 }}>
      <a href="/workspaces">← Back</a>
      <h1>Profile</h1>
      <label>Display name (username shown in UI)</label>
      <input
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        style={{ padding: 10, borderRadius: 10, border: "1px solid #ccc" }}
      />
      <button
        onClick={save}
        disabled={saving}
        style={{ padding: 10, borderRadius: 10, border: "1px solid #333", cursor: "pointer" }}
      >
        {saving ? "Saving…" : "Save"}
      </button>
    </main>
  );
}
