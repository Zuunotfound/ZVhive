"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/api";
import { useAuth } from "../../providers/AuthProvider";

type Blog = { id: string; title: string; content: string };

export default function BlogPage() {
  const [posts, setPosts] = useState<Blog[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { idToken } = useAuth();

  async function load() {
    const data = await apiFetch<Blog[]>("/api/blog/posts");
    setPosts(data);
  }
  useEffect(() => { load(); }, []);

  async function createPost() {
    if (!idToken) return;
    await apiFetch<Blog, { title: string; content: string }>("/api/blog/posts", {
      method: "POST",
      body: { title, content },
      idToken,
    });
    setTitle("");
    setContent("");
    await load();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Blog</h1>
      <div className="space-y-2">
        <input className="w-full bg-muted rounded px-3 py-2" placeholder="Judul" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea className="w-full bg-muted rounded px-3 py-2" placeholder="Konten" value={content} onChange={(e) => setContent(e.target.value)} />
        <button className="px-3 py-1 rounded bg-foreground text-background" onClick={createPost} disabled={!idToken}>Publikasikan (Admin)</button>
      </div>
      <ul className="space-y-3">
        {posts.map((p) => (
          <li key={p.id} className="border border-white/10 rounded p-4">
            <div className="font-semibold">{p.title}</div>
            <div className="text-sm text-muted whitespace-pre-wrap">{p.content}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

