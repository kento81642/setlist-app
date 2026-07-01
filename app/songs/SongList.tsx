"use client";

import { useEffect, useState } from "react";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableItem from "./SortableItem";
import { supabase } from "@/lib/supabase";
import CopyButton from "./CopyButton";
import { Song } from "./types";

type Props = {
  songs: Song[];
};

export default function SongList({ songs }: Props) {
  const [items, setItems] = useState(songs);

  useEffect(() => {
    setItems(songs);
  }, [songs]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((s) => s.id === active.id);
      const newIndex = items.findIndex((s) => s.id === over.id);
      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);
      await Promise.all(
        newItems.map((song, index) =>
          supabase.from("songs").update({ position: index }).eq("id", song.id),
        ),
      );
    }
  };

  if (items.length === 0) {
    return (
      <p className="text-gray-500 text-center py-8 bg-white rounded-xl shadow-sm">
        まだ曲がありません。上記フォームから追加してください。
      </p>
    );
  }

  const songCount = items.filter((song) => song.type === "song").length;
  const mcCount = items.filter((song) => song.type === "mc").length;
  const totalSeconds = items.reduce((sum, song) => sum + song.duration, 0);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;

  return (
    <>
      <p className="text-sm text-green-500 mb-3">
        楽曲{songCount}曲・MC{mcCount}回・合計{totalMinutes}分{remainingSeconds}
        秒
      </p>
      <CopyButton songs={items} />
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={items.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="space-y-2">
            {items.map((song, index) => (
              <SortableItem key={song.id} song={song} index={index} />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </>
  );
}
