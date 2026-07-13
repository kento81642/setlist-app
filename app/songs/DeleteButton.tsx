"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useToastStore } from "@/lib/toastStore";

type Props = {
  id: number;
};

export default function DeleteButton({ id }: Props) {
  const router = useRouter();
  const showToast = useToastStore((s) => s.showToast);

  const handleDelete = async () => {
    if (!window.confirm("本当に削除しますか?")) return;
    await supabase.from("songs").delete().eq("id", id);
    router.refresh();
    showToast("削除しました");
  };

  return (
    <button
      onClick={handleDelete}
      className="text-red-500 text-sm cursor-pointer"
    >
      削除
    </button>
  );
}
