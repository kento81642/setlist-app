'use client'

// Next.js 16 では params が Promise になった。
// Client Component では React の use() フックでアンラップする。
import { use } from 'react'
import SetlistEditor from '../SetlistEditor'

export default function SetlistEditorPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  return <SetlistEditor id={id} />
}
