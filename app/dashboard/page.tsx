'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Setlist,
  loadSetlists,
  saveSetlists,
  createEmptySetlist,
  parseDuration,
  formatTotal,
} from './data/setlists'

// ─── マイクのSVGイラスト（空の状態で表示） ──────────────────────────────────
function MicIllustration() {
  return (
    <svg className="h-24 w-24" viewBox="0 0 80 80" fill="none">
      <rect x="28" y="6" width="24" height="36" rx="12"
        fill="currentColor" opacity="0.18" stroke="currentColor" strokeWidth="2.5"/>
      <line x1="28" y1="24" x2="52" y2="24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.35"/>
      <line x1="28" y1="30" x2="52" y2="30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.35"/>
      <line x1="28" y1="36" x2="52" y2="36" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.35"/>
      <line x1="40" y1="42" x2="40" y2="60" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M24 60 Q40 71 56 60" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <path d="M18 16 Q13 24 18 32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.4"/>
      <path d="M62 16 Q67 24 62 32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.4"/>
      <path d="M10 10 Q5  24 10 38" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.22"/>
      <path d="M70 10 Q75 24 70 38" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.22"/>
    </svg>
  )
}

// ─── コンポーネント ───────────────────────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter()
  const [setlists, setSetlists] = useState<Setlist[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setSetlists(loadSetlists())
    setLoaded(true)
  }, [])

  function handleCreate() {
    const newSetlist = createEmptySetlist()
    const updated = [...setlists, newSetlist]
    saveSetlists(updated)
    router.push(`/dashboard/${newSetlist.id}`)
  }

  function handleDelete(id: string, title: string) {
    if (!confirm(`「${title}」を削除しますか？`)) return
    const updated = setlists.filter((s) => s.id !== id)
    setSetlists(updated)
    saveSetlists(updated)
  }

  if (!loaded) return null

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-3xl">

        {/* ── グラデーションヘッダーカード ───────────────────────────────── */}
        <div className="animate-fade-in-up mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-blue-500 p-6 text-white shadow-xl">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium tracking-widest text-indigo-200 uppercase">
                Setlist Manager
              </p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight">
                セトリ管理
              </h1>
              <p className="mt-1 text-sm text-indigo-200">
                {setlists.length > 0
                  ? `${setlists.length} 件のセトリ`
                  : 'ライブのセトリをまとめて管理'}
              </p>
            </div>
            {/* 音符の装飾（薄く表示） */}
            <div className="select-none text-[96px] leading-none text-white opacity-10 -mt-4 -mr-2">
              ♪
            </div>
          </div>

          {/* アクションボタン */}
          <div className="mt-5 flex flex-wrap gap-2">
            <button
              onClick={handleCreate}
              className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-indigo-600 shadow-sm transition-all hover:bg-indigo-50 hover:shadow active:scale-95"
            >
              + 新しいセトリを作成
            </button>
            <button
              onClick={() => router.push('/songs')}
              className="rounded-lg border border-white/30 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10 active:scale-95"
            >
              曲を管理
            </button>
          </div>
        </div>

        {/* ── 空の状態 ──────────────────────────────────────────────────── */}
        {setlists.length === 0 && (
          <div className="animate-fade-in-up rounded-2xl border-2 border-dashed border-gray-200 bg-white py-20 text-center"
            style={{ animationDelay: '0.15s' }}>
            <div className="mb-4 flex justify-center text-indigo-200 animate-float">
              <MicIllustration />
            </div>
            <p className="font-medium text-gray-400">まだセトリがありません</p>
            <p className="mt-1 text-sm text-gray-400">
              「新しいセトリを作成」から始めましょう
            </p>
          </div>
        )}

        {/* ── セトリカード一覧 ───────────────────────────────────────────── */}
        <div className="flex flex-col gap-3">
          {setlists.map((setlist, index) => {
            const totalSec = setlist.songs.reduce(
              (acc, s) => acc + parseDuration(s.duration),
              0
            )

            return (
              <div
                key={setlist.id}
                className="animate-fade-in-up rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <div className="flex items-start justify-between gap-4">

                  {/* セトリ情報 */}
                  <div className="min-w-0">
                    <h2 className="truncate font-semibold text-gray-900">
                      {setlist.title}
                    </h2>
                    <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-gray-400">
                      {setlist.date && (
                        <span className="flex items-center gap-1">
                          <span>📅</span>{setlist.date}
                        </span>
                      )}
                      {setlist.venue && (
                        <span className="flex items-center gap-1">
                          <span>📍</span>{setlist.venue}
                        </span>
                      )}
                      <span>{setlist.songs.length} 曲</span>
                      <span>{formatTotal(totalSec)}</span>
                    </div>
                  </div>

                  {/* 操作ボタン */}
                  <div className="flex shrink-0 gap-2">
                    <button
                      onClick={() => router.push(`/dashboard/${setlist.id}`)}
                      className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 active:scale-95"
                    >
                      編集
                    </button>
                    <button
                      onClick={() => handleDelete(setlist.id, setlist.title)}
                      className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-50 active:scale-95"
                    >
                      削除
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
