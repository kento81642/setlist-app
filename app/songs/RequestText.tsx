"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Props = {
  id: number;
  lightText: string;
  paText: string;
};

export default function RequestText({ id, lightText, paText }: Props) {
  const [editLightText, setEditLightText] = useState("");
  const [editPaText, setEditPaText] = useState("");
  const [lightTextIsEditing, setLightTextIsEditing] = useState(false);
  const [paTextIsEditing, setPaTextIsEditing] = useState(false);

  const router = useRouter();

  const lightTextHandleSave = async () => {
    await supabase
      .from("songs")
      .update({
        lightText: editLightText,
      })
      .eq("id", id);
    setLightTextIsEditing(false);
    router.refresh();
  };

  const paTextHandleSave = async () => {
    await supabase
      .from("songs")
      .update({
        paText: editPaText,
      })
      .eq("id", id);
    setPaTextIsEditing(false);
    router.refresh();
  };

  if (lightTextIsEditing) {
    return (
      <div>
        <textarea
          value={editLightText}
          onChange={(e) => setEditLightText(e.target.value)}
          placeholder="照明要望を入力"
          className="border p-2 rounded mr-2"
        />
        <button
          onClick={lightTextHandleSave}
          className="bg-gray-400 text-white px-3 py-1 rounded"
        >
          保存
        </button>
        <button
          onClick={() => setLightTextIsEditing(false)}
          className="bg-gray-400 text-white px-3 py-1 rounded"
        >
          キャンセル
        </button>
      </div>
    );
  }

  if (paTextIsEditing) {
    return (
      <div>
        <textarea
          value={editPaText}
          onChange={(e) => setEditPaText(e.target.value)}
          placeholder="PA要望を入力"
          className="border p-2 rounded mr-2"
        />
        <button
          onClick={paTextHandleSave}
          className="bg-gray-400 text-white px-3 py-1 rounded"
        >
          保存
        </button>
        <button
          onClick={() => setPaTextIsEditing(false)}
          className="bg-gray-400 text-white px-3 py-1 rounded"
        >
          キャンセル
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => setLightTextIsEditing(true)}
        className="bg-blue-300 border-2 border-blue-500 text-gray-500 text-sm mr-2 rounded cursor-pointer hover:bg-blue-200"
      >
        照明要望
      </button>
      <p className="font-bold text-gray-800 border border-gray-400 w-48 shrink-0">
        {lightText}
      </p>
      <button
        onClick={() => setPaTextIsEditing(true)}
        className="bg-green-300 border-2 border-green-500 text-gray-500 text-sm mr-2 rounded cursor-pointer hover:bg-green-200"
      >
        PA要望
      </button>
      <p className="font-bold text-gray-800 border border-gray-400 w-48 shrink-0">
        {paText}
      </p>
    </div>
  );
}
