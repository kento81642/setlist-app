import { supabase } from "@/lib/supabase";

export default async function Songs() {
  const { data: songs } = await supabase.from("songs").select("*");

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">曲一覧</h1>
      <ul className="space-y-2">
        {songs.map((song) => (
          <li key={song.id} className="bg-white p-4 rounded-xl shadow-sm">
            <p className="font-bold text-gray-800">{song.title}</p>
            <p className="text-sm text-gray-500">{song.artist}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
