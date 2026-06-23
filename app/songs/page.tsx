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
        {songs.map((song) => (
          <li key={song.id} className="bg-white p-4 rounded-xl shadow-sm">
            <EditSong id={song.id} title={song.title} artist={song.artist} />
          </li>
        ))}
      </ul>
    </main>
  );
}
