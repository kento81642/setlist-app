// ─── 型定義 ───────────────────────────────────────────────────────────────────
// bpm（数値）を廃止し、テンポをユーザーが直接選択する方式に変更。
// BPM 計算は複雑で初心者には不要な概念のため、シンプルな3択にした。

export type SongMaster = {
  id: string
  title: string
  duration: string                          // "3:45" 形式
  tempo: '遅め' | '普通' | '早め' | ''     // ユーザーが直接選ぶ
}

// ─── localStorage キー ────────────────────────────────────────────────────────

const SONG_LIBRARY_KEY = 'setlist_song_library'

// ─── localStorage 読み書き ────────────────────────────────────────────────────

export function loadSongLibrary(): SongMaster[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(SONG_LIBRARY_KEY)
    return raw ? (JSON.parse(raw) as SongMaster[]) : []
  } catch {
    return []
  }
}

export function saveSongLibrary(songs: SongMaster[]): void {
  localStorage.setItem(SONG_LIBRARY_KEY, JSON.stringify(songs))
}
