import type { Tag } from "./types"
import { apiClient } from "../../shared/lib/fetch"

export async function fetchTags(): Promise<Tag[]> {
  return apiClient("/api/posts/tags")
}
