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
};

export default function EditSong({ id, title, artist, type }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editArtist, seteditArtist] = useState(artist);
  const router = useRouter();

  const handleSave = async () => {
    await supabase
      .from("songs")
      .update({ title: editTitle, artist: editArtist })
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
        <input
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="border p-2 rounded mr-2"
        />
        <input
          value={editArtist}
          onChange={(e) => seteditArtist(e.target.value)}
          className="border p-2 rounded mr-2"
        />
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
        className="text-blue-500 text-sm mr-2"
      >
        編集
      </button>
      <DeleteButton id={id} />
    </div>
  );
}
