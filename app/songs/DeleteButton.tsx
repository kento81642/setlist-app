"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Props = {
  id: number;
};

export default function DeleteButton({ id }: Props) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!window.confirm("本当に削除しますか?")) return;
    await supabase.from("songs").delete().eq("id", id);
    router.refresh();
  };

  return (
    <button onClick={handleDelete} className="text-red-500 text-sm">
      削除
    </button>
  );
}
