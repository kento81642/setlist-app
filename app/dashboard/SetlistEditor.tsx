'use client'

import { useState } from 'react'
import { MASTER_SONGS, getBpmLabel } from './data/songs'

// ──────────────────────────────────────────
// 型定義：セットリスト1行分のデータ
// ──────────────────────────────────────────
type Song = {
  id: string           // 行の一意ID（削除・更新の特定に使う）
  songMasterId: string // 選択中のマスター曲ID（selectのvalue）
  title: string        // 曲名（マスターからコピー）
  duration: string     // 分数（マスターから自動入力・手動編集可）
  tempo: string        // テンポ（BPMから自動計算・読み取り専用）
  lighting: string     // 照明要望
  pa: string           // PA要望
  notes: string        // 備考
}

// 手動テキスト入力できるフィールド名の型
type ManualField = 'duration' | 'lighting' | 'pa' | 'notes'

// ──────────────────────────────────────────
// テキスト入力列の定義（照明要望・PA要望・備考）
// 曲名(select)・分数(別途)・テンポ(badge) は個別に扱う
// ──────────────────────────────────────────
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

// テンポラベル → バッジの色クラス
const TEMPO_STYLE: Record<string, string> = {
  '遅め': 'bg-blue-100 text-blue-700',
  '普通': 'bg-green-100 text-green-700',
  '早め': 'bg-orange-100 text-orange-700',
}

// ──────────────────────────────────────────
// 合計演奏時間の計算ヘルパー
// ──────────────────────────────────────────

// "3:45" → 225秒 に変換（不正な値は 0 として扱う）
function parseDuration(duration: string): number {
  const match = duration.match(/^(\d+):(\d{2})$/)
  if (!match) return 0
  return parseInt(match[1], 10) * 60 + parseInt(match[2], 10)
}

// 合計秒数 → "○分○秒" に変換
function formatTotal(totalSeconds: number): string {
  if (totalSeconds === 0) return '—'
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}分${seconds.toString().padStart(2, '0')}秒`
}

// ──────────────────────────────────────────
// 空の行データを作るヘルパー
// ──────────────────────────────────────────
function createEmptySong(): Song {
  return {
    id: crypto.randomUUID(),
    songMasterId: '',
    title: '',
    duration: '',
    tempo: '',
    lighting: '',
    pa: '',
    notes: '',
  }
}

// ──────────────────────────────────────────
// メインコンポーネント
// ──────────────────────────────────────────
export default function SetlistEditor() {
  const [songs, setSongs] = useState<Song[]>([createEmptySong()])

  // 末尾に空行を追加
  function addSong() {
    setSongs((prev) => [...prev, createEmptySong()])
  }

  // 指定IDの行を削除
  function removeSong(id: string) {
    setSongs((prev) => prev.filter((s) => s.id !== id))
  }

  // テキスト入力列を更新（duration / lighting / pa / notes）
  function updateSong(id: string, field: ManualField, value: string) {
    setSongs((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    )
  }

  // ドロップダウンで曲を選択したとき：
  // title・duration・tempo を一括で自動入力する
  function handleSongSelect(rowId: string, masterId: string) {
    const master = MASTER_SONGS.find((m) => m.id === masterId)

    setSongs((prev) =>
      prev.map((s) =>
        s.id === rowId
          ? {
              ...s,
              songMasterId: masterId,
              title:    master?.title            ?? '',
              duration: master?.duration         ?? '',
              tempo:    master ? getBpmLabel(master.bpm) : '',
            }
          : s
      )
    )
  }

  // songs配列の duration を合計する
  // reduce: 配列の全要素を1つの値にまとめる
  const totalSeconds = songs.reduce(
    (acc, song) => acc + parseDuration(song.duration),
    0  // ← 初期値（accの最初の値）
  )

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">

      {/* ヘッダー */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">セットリスト編集</h1>
          <p className="mt-0.5 text-sm text-gray-500">{songs.length} 曲</p>
        </div>
        <button
          onClick={addSong}
          className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 active:bg-blue-800"
        >
          <span className="text-base leading-none">+</span>
          行を追加
        </button>
      </div>

      {/* テーブル */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">

            {/* ヘッダー行 */}
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="w-10 px-3 py-3 text-center text-xs font-medium text-gray-400">#</th>
                <th className="min-w-[180px] px-3 py-3 text-left text-xs font-medium text-gray-500">曲名</th>
                <th className="min-w-[80px] px-3 py-3 text-left text-xs font-medium text-gray-500">分数</th>
                <th className="min-w-[80px] px-3 py-3 text-left text-xs font-medium text-gray-500">テンポ</th>
                {TEXT_COLUMNS.map((col) => (
                  <th key={col.key} className={`${col.width} px-3 py-3 text-left text-xs font-medium text-gray-500`}>
                    {col.label}
                  </th>
                ))}
                <th className="w-10 px-3 py-3" />
              </tr>
            </thead>

            {/* データ行 */}
            <tbody>
              {songs.map((song, index) => (
                <tr key={song.id} className="border-b border-gray-100 last:border-none hover:bg-gray-50/60">

                  {/* 行番号 */}
                  <td className="px-3 py-2 text-center text-xs text-gray-300">
                    {index + 1}
                  </td>

                  {/* 曲名：プルダウン選択 */}
                  <td className="min-w-[180px] px-3 py-2">
                    <select
                      value={song.songMasterId}
                      onChange={(e) => handleSongSelect(song.id, e.target.value)}
                      className="w-full rounded-md border border-gray-200 bg-white px-2 py-1.5 text-sm text-gray-900 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-300"
                    >
                      <option value="">— 曲を選択 —</option>
                      {MASTER_SONGS.map((master) => (
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

                  {/* テンポ：バッジ表示（BPMから自動計算・読み取り専用） */}
                  <td className="min-w-[80px] px-3 py-2">
                    {song.tempo ? (
                      <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${TEMPO_STYLE[song.tempo]}`}>
                        {song.tempo}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-300">—</span>
                    )}
                  </td>

                  {/* テキスト入力列（照明要望・PA要望・備考） */}
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

                  {/* 削除ボタン（1行しかない場合は無効） */}
                  <td className="px-3 py-2">
                    <button
                      onClick={() => removeSong(song.id)}
                      /*disabled={songs.length === 1} */
                      className="flex h-7 w-7 items-center justify-center rounded-md text-gray-300 hover:bg-red-50 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-30"
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

      <p className="mt-3 text-center text-xs text-gray-400 md:hidden">
        ← 左右にスクロールできます →
      </p>
    </div>
  )
}
