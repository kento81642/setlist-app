import { supabase } from "@/lib/supabase";
import AddSongForm from "./AddSongForm";
import DeleteButton from "./DeleteButton";
import EditSong from "./EditSong";

export default async function Songs() {
  const { data: songs } = await supabase.from("songs").select("*");

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">曲一覧</h1>
      <AddSongForm />
      <ul className="space-y-2">
        {songs.map((song, index) => (
          <li
            key={song.id}
            className={`p-4 rounded-xl shadow-sm flex items-center gap-3 ${index % 2 === 0 ? "bg-white" : "bg-blue-50"}`}
          >
            <span className="font-bold text-black p-5">{index + 1}</span>
            <div className="flex-1">
              <EditSong
                id={song.id}
                title={song.title}
                artist={song.artist}
                type={song.type}
              />
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
