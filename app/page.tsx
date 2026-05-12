import { redirect } from 'next/navigation'

// このファイルはサーバーコンポーネント（'use client' がない）。
// redirect() をそのまま呼ぶと、サーバー側で 307 リダイレクトが発生する。
// ユーザーが / にアクセスした瞬間に /login へ飛ばす。
export default function Home() {
  redirect('/login')
}
