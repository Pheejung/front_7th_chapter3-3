import type { Tag } from "./types"

export async function fetchTags(): Promise<Tag[]> {
  const res = await fetch("/api/posts/tags")
  return res.json()
}
