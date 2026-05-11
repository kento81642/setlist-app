// マスター曲データの型
export type SongMaster = {
  id: string
  title: string
  duration: string  // "3:45" 形式
  bpm: number       // テンポ自動判定に使う
}

// ダミー曲リスト（後でAPIやDBに差し替える）
export const MASTER_SONGS: SongMaster[] = [
  { id: '1',  title: '夜に駆ける',    duration: '4:08', bpm: 130 },
  { id: '2',  title: 'Pretender',     duration: '4:24', bpm: 96  },
  { id: '3',  title: 'ドライフラワー', duration: '4:15', bpm: 86  },
  { id: '4',  title: 'シルエット',    duration: '4:10', bpm: 168 },
  { id: '5',  title: 'KICK BACK',    duration: '3:04', bpm: 175 },
  { id: '6',  title: '残響散歌',      duration: '4:07', bpm: 185 },
  { id: '7',  title: 'うっせぇわ',   duration: '3:04', bpm: 175 },
  { id: '8',  title: '怪物',          duration: '3:29', bpm: 169 },
  { id: '9',  title: 'ハルジオン',    duration: '5:08', bpm: 95  },
  { id: '10', title: 'アイドル',      duration: '3:11', bpm: 170 },
]

// BPM数値 → テンポラベルに変換するヘルパー関数
export function getBpmLabel(bpm: number): '遅め' | '普通' | '早め' {
  if (bpm < 100) return '遅め'
  if (bpm < 160) return '普通'
  return '早め'
}
