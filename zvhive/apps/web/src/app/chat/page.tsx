"use client";
import { useAuth } from "../../providers/AuthProvider";
import { useEffect, useMemo, useRef, useState } from "react";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "firebase/firestore";
import { getFirebaseClientApp } from "../../lib/firebaseClient";

import type { DocumentData } from "firebase/firestore";
type ChatMessage = { id?: string; userId: string; text: string; createdAt?: DocumentData };

function getThreadId(a: string, b: string) {
  return [a, b].sort().join("_");
}

export default function ChatPage() {
  const { user } = useAuth();
  const [peerUid, setPeerUid] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const app = getFirebaseClientApp();
  const db = useMemo(() => getFirestore(app), [app]);
  const threadId = user && peerUid ? getThreadId(user.uid, peerUid) : "";

  useEffect(() => {
    if (!threadId) return;
    const q = query(collection(db, "chats", threadId, "messages"), orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      const docs = snap.docs.map((d) => ({ id: d.id, ...(d.data() as DocumentData) })) as ChatMessage[];
      setMessages(docs);
      setTimeout(() => scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: "smooth" }), 50);
    });
    return () => unsub();
  }, [db, threadId]);

  async function send() {
    if (!user || !threadId || !text.trim()) return;
    await addDoc(collection(db, "chats", threadId, "messages"), {
      userId: user.uid,
      text: text.trim(),
      createdAt: serverTimestamp(),
    });
    setText("");
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Private Chat</h1>
      <div className="space-y-2">
        <input
          className="w-full bg-muted rounded px-3 py-2"
          placeholder="Masukkan UID teman untuk memulai chat"
          value={peerUid}
          onChange={(e) => setPeerUid(e.target.value)}
        />
      </div>
      <div ref={scrollerRef} className="border border-white/10 rounded h-80 overflow-y-auto p-3 space-y-2 bg-muted">
        {messages.map((m) => (
          <div key={m.id} className={`max-w-[80%] px-3 py-2 rounded ${m.userId === user?.uid ? 'ml-auto bg-foreground text-background' : 'bg-background border border-white/10'}`}>
            <div className="text-xs opacity-70">{m.userId === user?.uid ? 'You' : m.userId}</div>
            <div>{m.text}</div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 bg-muted rounded px-3 py-2"
          placeholder="Tulis pesan..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
        />
        <button className="px-3 py-2 rounded bg-foreground text-background" onClick={send} disabled={!user || !peerUid}>Kirim</button>
      </div>
    </div>
  );
}

