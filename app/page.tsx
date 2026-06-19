import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-scren bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-x1 shadow-md">
        <h1 className="text-2x1 font-bold text-gray-800">
          セットリスト管理アプリ
        </h1>
        <Link
          href="/songs"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          曲一覧へ
        </Link>
      </div>
    </div>
  );
}
