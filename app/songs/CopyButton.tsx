"use client";
import { Song } from "./types";

type Props = {
  songs: Song[];
};

export default function CopyButton({ songs }: Props) {
  const text = songs
    .map((song) => (song.type === "mc" ? "MC" : song.title))
    .join("\n");
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    alert("コピーしました");
  };

  return (
    <button onClick={handleCopy} className="text-red-500 text-sm">
      曲順のコピー
    </button>
  );
}
