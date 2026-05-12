// ─── 型定義 ───────────────────────────────────────────────────────────────────

export type Song = {
  id: string
  songMasterId: string
  title: string
  duration: string
  tempo: string
  lighting: string
  pa: string
  notes: string
}

export type Setlist = {
  id: string
  title: string
  date: string    // "2025-06-15" 形式
  venue: string
  songs: Song[]
  createdAt: string
  updatedAt: string
}

// ─── localStorage のキー ──────────────────────────────────────────────────────

const STORAGE_KEY = 'setlist_app_data'

// ─── localStorage 読み書き ────────────────────────────────────────────────────

// localStorage はブラウザ専用の API。
// サーバー側（Next.js のビルド時など）では window が存在しないため、
// typeof window === 'undefined' で判定してから使う。
export function loadSetlists(): Setlist[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    // JSON.parse: 文字列 → JavaScript オブジェクトに変換
    return raw ? (JSON.parse(raw) as Setlist[]) : []
  } catch {
    return []
  }
}

export function saveSetlists(setlists: Setlist[]): void {
  // JSON.stringify: JavaScript オブジェクト → 文字列に変換（localStorage は文字列しか保存できない）
  localStorage.setItem(STORAGE_KEY, JSON.stringify(setlists))
}

// ─── ファクトリ関数 ───────────────────────────────────────────────────────────

export function createEmptySong(): Song {
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

export function createEmptySetlist(): Setlist {
  return {
    id: crypto.randomUUID(),
    title: '新しいセトリ',
    date: '',
    venue: '',
    songs: [createEmptySong()],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

// ─── 時間計算ヘルパー ─────────────────────────────────────────────────────────

// "3:45" → 225秒
export function parseDuration(duration: string): number {
  const match = duration.match(/^(\d+):(\d{2})$/)
  if (!match) return 0
  return parseInt(match[1], 10) * 60 + parseInt(match[2], 10)
}

// 合計秒数 → "○分○秒"
export function formatTotal(totalSeconds: number): string {
  if (totalSeconds === 0) return '—'
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}分${seconds.toString().padStart(2, '0')}秒`
}
