"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AddSongForm() {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const router = useRouter();

  const handleAdd = async () => {
    await supabase.from("songs").insert({ title, artist });
    setTitle("");
    setArtist("");
    router.refresh();
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm mb-4">
      <input
        type="text"
        placeholder="曲名"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 rounded mr-2"
      />
      <input
        type="text"
        placeholder="アーティスト名"
        value={artist}
        onChange={(e) => setArtist(e.target.value)}
        className="border p-2 rounded mr-2"
      />
      <button
        onClick={handleAdd}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        追加
      </button>
    </div>
  );
}
