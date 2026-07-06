"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AddSongForm() {
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [type, setType] = useState("song");
  const [bpm, setBpm] = useState("");
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");
  const router = useRouter();

  const handleAdd = async () => {
    if (type === "song" && (!title.trim() || !artist.trim())) {
      setError("曲名とアーティスト名を入力してください");
      return;
    }

    setError("");
    await supabase.from("songs").insert({
      title,
      artist,
      type,
      bpm: Number(bpm),
      position: Date.now(),
      duration: 60 * Number(minutes) + Number(seconds),
    });
    setTitle("");
    setArtist("");
    setType("song");
    setBpm("");
    setMinutes("");
    setSeconds("");
    router.refresh();
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
      <div className="flex flex-wrap gap-2">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="song">曲</option>
          <option value="mc">MC</option>
        </select>

        <input
          type="text"
          placeholder="曲名"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={type === "mc"}
          className={`border border-gray-300 p-2 rounded flex-1 min-w-0 ${type === "mc" ? "bg-gray-200" : ""}`}
        />
        <input
          type="text"
          placeholder="アーティスト名"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          disabled={type === "mc"}
          className={`border border-gray-300 p-2 rounded flex-1 min-w-0 ${type === "mc" ? "bg-gray-200" : ""}`}
        />
        <input
          type="number"
          placeholder="分"
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
          disabled={type === "mc"}
          className={`border border-gray-300 p-2 rounded flex-1 min-w-0 ${type === "mc" ? "bg-gray-200" : ""}`}
        />
        <input
          type="number"
          placeholder="秒"
          value={seconds}
          onChange={(e) => setSeconds(e.target.value)}
          disabled={type === "mc"}
          className={`border border-gray-300 p-2 rounded flex-1 min-w-0 ${type === "mc" ? "bg-gray-200" : ""}`}
        />
        <input
          type="number"
          placeholder="BPM"
          value={bpm}
          onChange={(e) => setBpm(e.target.value)}
          disabled={type === "mc"}
          className={`border border-gray-300 p-2 rounded flex-1 min-w-0 ${type === "mc" ? "bg-gray-200" : ""}`}
        />
        <button
          onClick={handleAdd}
          className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600"
        >
          追加
        </button>
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}
