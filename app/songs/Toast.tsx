"use client";

import { use, useEffect } from "react";
import { useToastStore } from "@/lib/toastStore";

export default function Toast() {
  const message = useToastStore((s) => s.message);
  const clearToast = useToastStore((s) => s.clearToast);

  useEffect(() => {
    if (message === "") return;
    const timer = setTimeout(() => clearToast(), 2500);
    return () => clearTimeout(timer);
  }, [message, clearToast]);

  if (message === "") return null;

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded shadow-lg">
      {message}
    </div>
  );
}
