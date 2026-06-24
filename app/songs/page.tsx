import { supabase } from "@/lib/supabase";
import AddSongForm from "./AddSongForm";
import SongList from "./SongList";

export default async function Songs() {
  const { data: songs } = await supabase
    .from("songs")
    .select("*")
    .order("position");

  return (
    <main className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-1">セットリスト</h1>
        <p className="text-gray-500 mb-6">
          曲を追加・ドラッグで並び替えできます
        </p>
        <AddSongForm />
        <SongList songs={songs ?? []} />
      </div>
    </main>
  );
}
