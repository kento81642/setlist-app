"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import EditSong from "./EditSong";
import { Song } from "./types";
import RequestText from "./RequestText";

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
      className={`p-4 rounded-xl shadow-sm flex flex-col gap-2 ${index % 2 === 0 ? "bg-white" : "bg-blue-50"}`}
    >
      <div className="flex items-center gap-3">
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
            bpm={song.bpm}
          />
        </div>
        {song.type === "song" && (
          <span className="text-base text-gray-500 mr-5">
            時間：{Math.floor(song.duration / 60)}分{song.duration % 60}秒
          </span>
        )}
        {song.bpm >= 60 && song.bpm <= 120 && (
          <span className="text-base text-gray-500 mr-5">
            テンポ：遅い（BPM：{song.bpm}）
          </span>
        )}
        {song.bpm >= 121 && song.bpm <= 169 && (
          <span className="text-base text-gray-500 mr-5">
            テンポ：普通（BPM：{song.bpm}）
          </span>
        )}
        {song.bpm >= 170 && (
          <span className="text-base text-gray-500 mr-5">
            テンポ：速い（BPM：{song.bpm}）
          </span>
        )}
      </div>
      <div className="flex items-center gap-3">
        <RequestText
          id={song.id}
          lightText={song.lightText}
          paText={song.paText}
        />
      </div>
    </li>
  );
}
