"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import EditSong from "./EditSong";

type Song = {
  id: number;
  title: string;
  artist: string;
  type: string;
  position: number;
  duration: number;
};

type Props = {
  song: Song;
  index: number;
};

export default function SortableItem({ song, index }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: song.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`p-4 rounded-xl shadow-sm flex items-center gap-3 ${index % 2 === 0 ? "bg-white" : "bg-blue-50"}`}
    >
      <span {...listeners} className="cursor-grab text-gray-400 select-none">
        ⠿
      </span>
      <span className="font-bold text-black p-2">{index + 1}</span>
      <div className="flex-1">
        <EditSong
          id={song.id}
          title={song.title}
          artist={song.artist}
          type={song.type}
          duration={song.duration}
        />
      </div>
      {song.type === "song" && (
        <span className="text-base text-gray-500 mr-5">
          {Math.floor(song.duration / 60)}分{song.duration % 60}秒
        </span>
      )}
    </li>
  );
}
