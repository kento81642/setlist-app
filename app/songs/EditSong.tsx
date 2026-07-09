"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import DeleteButton from "./DeleteButton";

type Props = {
  id: number;
  title: string;
  artist: string;
  type: string;
  duration: number;
  bpm: number;
};

export default function EditSong({
  id,
  title,
  artist,
  type,
  duration,
  bpm,
}: Props) {
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editArtist, setEditArtist] = useState(artist);
  const [editBpm, setEditBpm] = useState(String(bpm));
  const [editMinutes, setEditMinutes] = useState(String(minutes));
  const [editSeconds, setEditSeconds] = useState(String(seconds));

  const router = useRouter();

  const handleSave = async () => {
    await supabase
      .from("songs")
      .update({
        title: editTitle,
        artist: editArtist,
        duration: Number(editMinutes) * 60 + Number(editSeconds),
        bpm: Number(editBpm),
      })
      .eq("id", id);
    setIsEditing(false);
    router.refresh();
  };

  if (type === "mc") {
    return (
      <div className="items-center justify-between">
        <p className="font-bold text-gray-600">MC</p>
        <DeleteButton id={id} />
      </div>
    );
  }

  if (isEditing) {
    return (
      <div>
        <label className="mr-2">
          曲名：
          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="border p-2 rounded mr-2"
          />
        </label>
        <label className="mr-2">
          アーティスト名：
          <input
            value={editArtist}
            onChange={(e) => setEditArtist(e.target.value)}
            className="border p-2 rounded mr-2"
          />
        </label>
        <label className="mr-2">
          分：
          <input
            value={editMinutes}
            onChange={(e) => setEditMinutes(e.target.value)}
            className="border p-2 rounded mr-2"
          />
        </label>
        <label className="mr-2">
          秒：
          <input
            value={editSeconds}
            onChange={(e) => setEditSeconds(e.target.value)}
            className="border p-2 rounded mr-2"
          />
        </label>
        <label className="mr-2">
          BPM：
          <input
            value={editBpm}
            onChange={(e) => setEditBpm(e.target.value)}
            className="border p-2 rounded mr-2"
          />
        </label>
        <button
          onClick={handleSave}
          className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
        >
          保存
        </button>
        <button
          onClick={() => setIsEditing(false)}
          className="bg-gray-400 text-white px-3 py-1 rounded"
        >
          キャンセル
        </button>
      </div>
    );
  }

  return (
    <div>
      <p className="font-bold text-gray-800">{title}</p>
      <p className="text-sm text-gray-500">{artist}</p>
      <button
        onClick={() => setIsEditing(true)}
        className="text-blue-500 text-sm mr-2 cursor-pointer"
      >
        編集
      </button>
      <DeleteButton id={id} />
    </div>
  );
}
