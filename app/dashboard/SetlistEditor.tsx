'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { SongMaster, loadSongLibrary } from './data/songs'
import {
  Setlist,
  Song,
  loadSetlists,
  saveSetlists,
  createEmptySong,
  parseDuration,
  formatTotal,
} from './data/setlists'

// ─── 型定義 ───────────────────────────────────────────────────────────────────

type ManualField = 'duration' | 'lighting' | 'pa' | 'notes'
type TextColumnField = 'lighting' | 'pa' | 'notes'

const TEXT_COLUMNS: {
  key: TextColumnField
  label: string
  placeholder: string
  width: string
}[] = [
  { key: 'lighting', label: '照明要望', placeholder: '赤系・暗め',  width: 'min-w-[128px]' },
  { key: 'pa',       label: 'PA要望',  placeholder: 'Vo +3dB',     width: 'min-w-[128px]' },
  { key: 'notes',    label: '備考',    placeholder: '転換・MCなど', width: 'min-w-[160px]' },
]

const TEMPO_STYLE: Record<string, string> = {
  '遅め': 'bg-blue-100 text-blue-700',
  '普通': 'bg-green-100 text-green-700',
  '早め': 'bg-orange-100 text-orange-700',
}

// ─── コンポーネント ───────────────────────────────────────────────────────────

// props として id を受け取る。どのセトリを表示するか URL から決まる。
export default function SetlistEditor({ id }: { id: string }) {
  const router = useRouter()
  const [setlist, setSetlist] = useState<Setlist | null>(null)

  // 曲ライブラリ（localStorage から読み込んだユーザー登録曲）
  const [songLibrary, setSongLibrary] = useState<SongMaster[]>([])

  // ① マウント時：セトリと曲ライブラリを localStorage から読み込む
  useEffect(() => {
    const found = loadSetlists().find((s) => s.id === id)
    if (!found) {
      // 存在しない id なら一覧に戻す
      router.push('/dashboard')
      return
    }
    setSetlist(found)
    setSongLibrary(loadSongLibrary())
  }, [id, router])

  // ② setlist が更新されるたびに localStorage へ自動保存
  // setlist が null のとき（初回読み込み前）はスキップ
  useEffect(() => {
    if (!setlist) return
    const all = loadSetlists()
    const updated = all.map((s) => (s.id === setlist.id ? setlist : s))
    saveSetlists(updated)
  }, [setlist])

  // 読み込み中
  if (!setlist) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-400">読み込み中...</p>
      </div>
    )
  }

  // ─── イベントハンドラ ─────────────────────────────────────────────────────

  // タイトル・日付・会場を更新
  function updateMeta(field: 'title' | 'date' | 'venue', value: string) {
    setSetlist((prev) =>
      prev ? { ...prev, [field]: value, updatedAt: new Date().toISOString() } : prev
    )
  }

  // 末尾に空行を追加
  function addSong() {
    setSetlist((prev) =>
      prev
        ? {
            ...prev,
            songs: [...prev.songs, createEmptySong()],
            updatedAt: new Date().toISOString(),
          }
        : prev
    )
  }

  // 指定 id の行を削除
  function removeSong(songId: string) {
    setSetlist((prev) =>
      prev
        ? {
            ...prev,
            songs: prev.songs.filter((s) => s.id !== songId),
            updatedAt: new Date().toISOString(),
          }
        : prev
    )
  }

  // テキスト入力列を更新
  function updateSong(songId: string, field: ManualField, value: string) {
    setSetlist((prev) =>
      prev
        ? {
            ...prev,
            songs: prev.songs.map((s) =>
              s.id === songId ? { ...s, [field]: value } : s
            ),
            updatedAt: new Date().toISOString(),
          }
        : prev
    )
  }

  // ドロップダウンで曲を選択したとき
  function handleSongSelect(songId: string, masterId: string) {
    const master = songLibrary.find((m) => m.id === masterId)
    setSetlist((prev) =>
      prev
        ? {
            ...prev,
            songs: prev.songs.map((s) =>
              s.id === songId
                ? {
                    ...s,
                    songMasterId: masterId,
                    title:    master?.title    ?? '',
                    duration: master?.duration ?? '',
                    tempo:    master?.tempo    ?? '',
                  }
                : s
            ),
            updatedAt: new Date().toISOString(),
          }
        : prev
    )
  }

  // 曲の並び替え（上下ボタン）
  // 配列のスワップ: [arr[i], arr[j]] = [arr[j], arr[i]] で隣の要素と入れ替える
  function moveSong(songId: string, direction: 'up' | 'down') {
    setSetlist((prev) => {
      if (!prev) return prev
      const songs = [...prev.songs]
      const index = songs.findIndex((s) => s.id === songId)

      if (direction === 'up' && index > 0) {
        ;[songs[index - 1], songs[index]] = [songs[index], songs[index - 1]]
      } else if (direction === 'down' && index < songs.length - 1) {
        ;[songs[index + 1], songs[index]] = [songs[index], songs[index + 1]]
      }

      return { ...prev, songs, updatedAt: new Date().toISOString() }
    })
  }

  const totalSeconds = setlist.songs.reduce(
    (acc, s) => acc + parseDuration(s.duration),
    0
  )

  // ─── 描画 ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">

      {/* ── 印刷時のみ表示するヘッダー ── */}
      <div className="print-only mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{setlist.title}</h1>
        <p className="mt-1 text-sm text-gray-500">
          {[setlist.date, setlist.venue].filter(Boolean).join('　')}
        </p>
      </div>

      {/* ── 通常時のヘッダー（印刷時は非表示） ── */}
      <div className="no-print mb-6">

        {/* 戻るボタン */}
        <button
          onClick={() => router.push('/dashboard')}
          className="mb-4 flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600"
        >
          ← セトリ一覧に戻る
        </button>

        {/* メタ情報入力 + アクションボタン */}
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[180px] flex-1">
            <label className="mb-1 block text-xs font-medium text-gray-400">
              セトリ名
            </label>
            <input
              type="text"
              value={setlist.title}
              onChange={(e) => updateMeta('title', e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-base font-bold text-gray-900 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-400">
              ライブ日
            </label>
            <input
              type="date"
              value={setlist.date}
              onChange={(e) => updateMeta('date', e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-300"
            />
          </div>

          <div className="min-w-[140px] flex-1">
            <label className="mb-1 block text-xs font-medium text-gray-400">
              会場
            </label>
            <input
              type="text"
              value={setlist.venue}
              onChange={(e) => updateMeta('venue', e.target.value)}
              placeholder="Zepp Shinjuku"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-300"
            />
          </div>

          <button
            onClick={addSong}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 active:bg-blue-800"
          >
            <span className="text-base leading-none">+</span>
            行を追加
          </button>

          {/* PDF出力ボタン：window.print() でブラウザの印刷ダイアログを開く */}
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            印刷 / PDF保存
          </button>
        </div>

        <p className="mt-2 flex items-center gap-1.5 text-xs text-gray-400">
          {/* 緑の点が点滅することで「保存されている」状態を視覚的に伝える */}
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse-dot" />
          {setlist.songs.length} 曲 ・ 自動保存中
        </p>
      </div>

      {/* 曲ライブラリが空のとき：曲管理ページへの案内 */}
      {songLibrary.length === 0 && (
        <div className="no-print mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          曲ライブラリが空です。
          <button
            onClick={() => router.push('/songs')}
            className="ml-1 underline hover:text-amber-900"
          >
            曲を追加する →
          </button>
        </div>
      )}

      {/* ── 通常時の編集テーブル（印刷時は非表示） ── */}
      <div className="no-print rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">

            {/* ヘッダー行 */}
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="w-10 px-3 py-3 text-center text-xs font-medium text-gray-400">#</th>
                <th className="w-14 px-1 py-3 text-center text-xs font-medium text-gray-400">並替</th>
                <th className="min-w-[180px] px-3 py-3 text-left text-xs font-medium text-gray-500">曲名</th>
                <th className="min-w-[80px] px-3 py-3 text-left text-xs font-medium text-gray-500">分数</th>
                <th className="min-w-[80px] px-3 py-3 text-left text-xs font-medium text-gray-500">テンポ</th>
                {TEXT_COLUMNS.map((col) => (
                  <th
                    key={col.key}
                    className={`${col.width} px-3 py-3 text-left text-xs font-medium text-gray-500`}
                  >
                    {col.label}
                  </th>
                ))}
                <th className="w-10 px-3 py-3" />
              </tr>
            </thead>

            {/* データ行 */}
            <tbody>
              {setlist.songs.map((song, index) => (
                <tr
                  key={song.id}
                  className="border-b border-gray-100 last:border-none hover:bg-gray-50/60"
                >
                  {/* 行番号 */}
                  <td className="px-3 py-2 text-center text-xs text-gray-300">
                    {index + 1}
                  </td>

                  {/* 並び替えボタン ▲▼ */}
                  <td className="px-1 py-2">
                    <div className="flex flex-col items-center gap-0.5">
                      <button
                        onClick={() => moveSong(song.id, 'up')}
                        disabled={index === 0}
                        className="flex h-5 w-6 items-center justify-center rounded text-xs text-gray-300 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-20"
                        aria-label="上に移動"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => moveSong(song.id, 'down')}
                        disabled={index === setlist.songs.length - 1}
                        className="flex h-5 w-6 items-center justify-center rounded text-xs text-gray-300 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-20"
                        aria-label="下に移動"
                      >
                        ▼
                      </button>
                    </div>
                  </td>

                  {/* 曲名：プルダウン選択 */}
                  <td className="min-w-[180px] px-3 py-2">
                    <select
                      value={song.songMasterId}
                      onChange={(e) => handleSongSelect(song.id, e.target.value)}
                      className="w-full rounded-md border border-gray-200 bg-white px-2 py-1.5 text-sm text-gray-900 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-300"
                    >
                      <option value="">
                        {songLibrary.length === 0 ? '（曲ライブラリが空です）' : '— 曲を選択 —'}
                      </option>
                      {songLibrary.map((master) => (
                        <option key={master.id} value={master.id}>
                          {master.title}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* 分数：自動入力・手動編集可 */}
                  <td className="min-w-[80px] px-3 py-2">
                    <input
                      type="text"
                      value={song.duration}
                      onChange={(e) => updateSong(song.id, 'duration', e.target.value)}
                      placeholder="-"
                      className="w-full rounded-md border border-transparent px-2 py-1.5 text-gray-900 placeholder-gray-300 outline-none hover:border-gray-200 focus:border-blue-400 focus:bg-blue-50 focus:ring-1 focus:ring-blue-300"
                    />
                  </td>

                  {/* テンポ：バッジ表示 */}
                  <td className="min-w-[80px] px-3 py-2">
                    {song.tempo ? (
                      <span
                        className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${TEMPO_STYLE[song.tempo]}`}
                      >
                        {song.tempo}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-300">—</span>
                    )}
                  </td>

                  {/* テキスト入力列 */}
                  {TEXT_COLUMNS.map((col) => (
                    <td key={col.key} className={`${col.width} px-3 py-2`}>
                      <input
                        type="text"
                        value={song[col.key]}
                        onChange={(e) => updateSong(song.id, col.key, e.target.value)}
                        placeholder={col.placeholder}
                        className="w-full rounded-md border border-transparent px-2 py-1.5 text-gray-900 placeholder-gray-300 outline-none hover:border-gray-200 focus:border-blue-400 focus:bg-blue-50 focus:ring-1 focus:ring-blue-300"
                      />
                    </td>
                  ))}

                  {/* 削除ボタン */}
                  <td className="px-3 py-2">
                    <button
                      onClick={() => removeSong(song.id)}
                      className="flex h-7 w-7 items-center justify-center rounded-md text-gray-300 hover:bg-red-50 hover:text-red-400"
                      aria-label="行を削除"
                    >
                      削除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

            {/* フッター：合計演奏時間 */}
            <tfoot>
              <tr className="border-t-2 border-gray-200 bg-gray-50">
                <td
                  colSpan={5 + TEXT_COLUMNS.length}
                  className="px-4 py-3 text-right text-sm"
                >
                  <span className="text-gray-500">合計演奏時間：</span>
                  <span className="font-semibold text-gray-900">
                    {formatTotal(totalSeconds)}
                  </span>
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* ── 印刷時のクリーンなテーブル（通常時は非表示） ── */}
      <div className="print-only">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b-2 border-gray-900">
              <th className="w-8 pb-2 text-left text-xs font-bold text-gray-700">#</th>
              <th className="pb-2 text-left text-xs font-bold text-gray-700">曲名</th>
              <th className="w-14 pb-2 text-left text-xs font-bold text-gray-700">分数</th>
              <th className="w-14 pb-2 text-left text-xs font-bold text-gray-700">テンポ</th>
              <th className="w-24 pb-2 text-left text-xs font-bold text-gray-700">照明要望</th>
              <th className="w-24 pb-2 text-left text-xs font-bold text-gray-700">PA要望</th>
              <th className="pb-2 text-left text-xs font-bold text-gray-700">備考</th>
            </tr>
          </thead>
          <tbody>
            {setlist.songs.map((song, index) => (
              <tr key={song.id} className="border-b border-gray-200">
                <td className="py-1.5 text-xs text-gray-500">{index + 1}</td>
                <td className="py-1.5 font-medium text-gray-900">{song.title || '—'}</td>
                <td className="py-1.5 text-xs text-gray-700">{song.duration || '—'}</td>
                <td className="py-1.5 text-xs text-gray-700">{song.tempo || '—'}</td>
                <td className="py-1.5 text-xs text-gray-600">{song.lighting}</td>
                <td className="py-1.5 text-xs text-gray-600">{song.pa}</td>
                <td className="py-1.5 text-xs text-gray-600">{song.notes}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-gray-900">
              <td colSpan={7} className="pt-2 text-right text-xs text-gray-700">
                合計演奏時間：
                <strong className="ml-1 text-gray-900">{formatTotal(totalSeconds)}</strong>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <p className="no-print mt-3 text-center text-xs text-gray-400 md:hidden">
        ← 左右にスクロールできます →
      </p>
    </div>
  )
}
