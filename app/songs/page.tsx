'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { SongMaster, loadSongLibrary, saveSongLibrary } from '../dashboard/data/songs'

// ─── 型定義 ───────────────────────────────────────────────────────────────────
type FormState = { title: string; duration: string; tempo: SongMaster['tempo'] }
const EMPTY_FORM: FormState = { title: '', duration: '', tempo: '' }

const TEMPO_OPTIONS: { value: SongMaster['tempo']; label: string }[] = [
  { value: '',    label: 'テンポ未設定' },
  { value: '遅め', label: '遅め（〜100 BPM）' },
  { value: '普通', label: '普通（100〜160 BPM）' },
  { value: '早め', label: '早め（160 BPM〜）' },
]

const TEMPO_STYLE: Record<string, string> = {
  '遅め': 'bg-blue-100 text-blue-700',
  '普通': 'bg-green-100 text-green-700',
  '早め': 'bg-orange-100 text-orange-700',
}

// ─── 音符SVGイラスト（空の状態で表示） ───────────────────────────────────────
function NoteIllustration() {
  return (
    <svg className="h-24 w-24" viewBox="0 0 80 90" fill="none">
      {/* 五線譜（薄い横線） */}
      {[50, 58, 66, 74, 82].map((y) => (
        <line key={y} x1="4" y1={y} x2="76" y2={y}
          stroke="currentColor" strokeWidth="1.5" opacity="0.15"/>
      ))}
      {/* 音符1（右・メイン） */}
      <line x1="56" y1="12" x2="56" y2="72" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
      <ellipse cx="44" cy="74" rx="15" ry="10" fill="currentColor" transform="rotate(-18 44 74)"/>
      <path d="M56 12 Q76 20 70 38" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none"/>
      {/* 音符2（左・薄め） */}
      <line x1="24" y1="20" x2="24" y2="76" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" opacity="0.45"/>
      <ellipse cx="12" cy="78" rx="14" ry="9" fill="currentColor" opacity="0.45" transform="rotate(-18 12 78)"/>
      <path d="M24 20 Q44 28 38 46" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" fill="none" opacity="0.45"/>
    </svg>
  )
}

// ─── コンポーネント ───────────────────────────────────────────────────────────
export default function SongsPage() {
  const router = useRouter()
  const [songs, setSongs] = useState<SongMaster[]>([])
  const [loaded, setLoaded] = useState(false)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [formError, setFormError] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<FormState>(EMPTY_FORM)
  const [justAddedId, setJustAddedId] = useState<string | null>(null)

  useEffect(() => {
    setSongs(loadSongLibrary())
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (!loaded) return
    saveSongLibrary(songs)
  }, [songs, loaded])

  function handleAdd() {
    if (!form.title.trim()) {
      setFormError('曲名を入力してください')
      return
    }
    const newId = crypto.randomUUID()
    setSongs((prev) => [
      ...prev,
      { id: newId, title: form.title.trim(), duration: form.duration.trim(), tempo: form.tempo },
    ])
    setJustAddedId(newId)
    setTimeout(() => setJustAddedId(null), 1200)
    setForm(EMPTY_FORM)
    setFormError('')
  }

  function handleDelete(id: string, title: string) {
    if (!confirm(`「${title}」を削除しますか？`)) return
    setSongs((prev) => prev.filter((s) => s.id !== id))
  }

  function startEdit(song: SongMaster) {
    setEditingId(song.id)
    setEditForm({ title: song.title, duration: song.duration, tempo: song.tempo })
  }

  function saveEdit() {
    if (!editForm.title.trim()) return
    setSongs((prev) =>
      prev.map((s) =>
        s.id === editingId
          ? { ...s, title: editForm.title.trim(), duration: editForm.duration.trim(), tempo: editForm.tempo }
          : s
      )
    )
    setEditingId(null)
  }

  function cancelEdit() { setEditingId(null) }

  if (!loaded) return null

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-2xl">

        {/* ── グラデーションヘッダーカード ───────────────────────────────── */}
        <div className="animate-fade-in-up mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-purple-500 to-indigo-500 p-6 text-white shadow-xl">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium tracking-widest text-purple-200 uppercase">
                Song Library
              </p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight">曲ライブラリ</h1>
              <p className="mt-1 text-sm text-purple-200">
                {songs.length > 0 ? `${songs.length} 曲登録済み` : 'バンドの曲をまとめて登録'}
              </p>
            </div>
            <div className="select-none text-[96px] leading-none text-white opacity-10 -mt-4 -mr-2">
              ♬
            </div>
          </div>
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-4 rounded-lg border border-white/30 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-white/10 active:scale-95"
          >
            ← ダッシュボードに戻る
          </button>
        </div>

        {/* ── 追加フォーム ─────────────────────────────────────────────── */}
        <div className="animate-fade-in-up mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          style={{ animationDelay: '0.1s' }}>
          <h2 className="mb-3 text-sm font-semibold text-gray-700">曲を追加</h2>
          {formError && (
            <p className="mb-2 text-xs text-red-500">{formError}</p>
          )}
          <div className="flex flex-wrap gap-2">
            <input
              type="text"
              value={form.title}
              onChange={(e) => { setForm((f) => ({ ...f, title: e.target.value })); setFormError('') }}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              placeholder="曲名 *"
              className="min-w-[160px] flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none transition-colors focus:border-indigo-400 focus:ring-1 focus:ring-indigo-300"
            />
            <input
              type="text"
              value={form.duration}
              onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              placeholder="分数（例：3:45）"
              className="w-36 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none transition-colors focus:border-indigo-400 focus:ring-1 focus:ring-indigo-300"
            />
            <select
              value={form.tempo}
              onChange={(e) => setForm((f) => ({ ...f, tempo: e.target.value as SongMaster['tempo'] }))}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none transition-colors focus:border-indigo-400 focus:ring-1 focus:ring-indigo-300"
            >
              {TEMPO_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <button
              onClick={handleAdd}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-indigo-700 active:scale-95"
            >
              追加
            </button>
          </div>
        </div>

        {/* ── 空の状態 ──────────────────────────────────────────────────── */}
        {songs.length === 0 && (
          <div className="animate-fade-in-up rounded-2xl border-2 border-dashed border-gray-200 bg-white py-20 text-center"
            style={{ animationDelay: '0.2s' }}>
            <div className="mb-4 flex justify-center text-purple-200 animate-float">
              <NoteIllustration />
            </div>
            <p className="font-medium text-gray-400">まだ曲が登録されていません</p>
            <p className="mt-1 text-sm text-gray-400">上のフォームから追加してください</p>
          </div>
        )}

        {/* ── 曲一覧テーブル ──────────────────────────────────────────── */}
        {songs.length > 0 && (
          <div className="animate-fade-in-up rounded-xl border border-gray-200 bg-white shadow-sm"
            style={{ animationDelay: '0.15s' }}>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="w-10 px-3 py-3 text-center text-xs font-medium text-gray-400">#</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500">曲名</th>
                  <th className="w-20 px-3 py-3 text-left text-xs font-medium text-gray-500">分数</th>
                  <th className="w-20 px-3 py-3 text-left text-xs font-medium text-gray-500">テンポ</th>
                  <th className="w-28 px-3 py-3" />
                </tr>
              </thead>
              <tbody>
                {songs.map((song, index) =>
                  editingId === song.id ? (

                    // ── 編集モード行 ──────────────────────────────────────
                    <tr key={song.id} className="border-b border-gray-100 last:border-none bg-indigo-50/40">
                      <td className="px-3 py-2 text-center text-xs text-gray-300">{index + 1}</td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={editForm.title}
                          onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                          className="w-full rounded-md border border-indigo-300 px-2 py-1 text-sm text-gray-900 outline-none focus:ring-1 focus:ring-indigo-300"
                          autoFocus
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={editForm.duration}
                          onChange={(e) => setEditForm((f) => ({ ...f, duration: e.target.value }))}
                          placeholder="3:45"
                          className="w-full rounded-md border border-indigo-300 px-2 py-1 text-sm text-gray-900 outline-none focus:ring-1 focus:ring-indigo-300"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <select
                          value={editForm.tempo}
                          onChange={(e) => setEditForm((f) => ({ ...f, tempo: e.target.value as SongMaster['tempo'] }))}
                          className="w-full rounded-md border border-indigo-300 px-2 py-1 text-sm text-gray-700 outline-none focus:ring-1 focus:ring-indigo-300"
                        >
                          {TEMPO_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex gap-1">
                          <button onClick={saveEdit}
                            className="rounded px-2 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50">
                            保存
                          </button>
                          <button onClick={cancelEdit}
                            className="rounded px-2 py-1 text-xs font-medium text-gray-400 hover:bg-gray-100">
                            取消
                          </button>
                        </div>
                      </td>
                    </tr>

                  ) : (

                    // ── 表示モード行 ──────────────────────────────────────
                    <tr
                      key={song.id}
                      className={`border-b border-gray-100 last:border-none transition-colors ${
                        justAddedId === song.id
                          ? 'bg-green-50'
                          : 'hover:bg-gray-50/60'
                      }`}
                    >
                      <td className="px-3 py-2 text-center text-xs text-gray-300">{index + 1}</td>
                      <td className="px-3 py-2 font-medium text-gray-900">{song.title}</td>
                      <td className="px-3 py-2 text-xs text-gray-600">{song.duration || '—'}</td>
                      <td className="px-3 py-2">
                        {song.tempo ? (
                          <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${TEMPO_STYLE[song.tempo]}`}>
                            {song.tempo}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-300">—</span>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex gap-1">
                          <button onClick={() => startEdit(song)}
                            className="rounded px-2 py-1 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-100">
                            編集
                          </button>
                          <button onClick={() => handleDelete(song.id, song.title)}
                            className="rounded px-2 py-1 text-xs font-medium text-red-400 transition-colors hover:bg-red-50">
                            削除
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
