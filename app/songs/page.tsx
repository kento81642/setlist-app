import { supabase } from "@/lib/supabase";
import AddSongForm from "./AddSongForm";
import DeleteButton from "./DeleteButton";
import EditSong from "./EditSong";
import SongList from "./SongList";

export default async function Songs() {
  const { data: songs } = await supabase
    .from("songs")
    .select("*")
    .order("position");

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">曲一覧</h1>
      <AddSongForm />
      <SongList songs={songs ?? []} />
    </main>
  );
}
