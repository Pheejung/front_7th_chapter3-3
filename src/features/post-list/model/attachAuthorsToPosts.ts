import type { Post } from '../../../entities/post/types'
import type { User } from '../../../entities/user/types'

export type PostWithAuthor = Post & { author: User | null }

/**
 * Attach author objects to posts by matching post.userId -> user.id
 * Returns a new array (does not mutate inputs)
 */
export function attachAuthorsToPosts(
  posts: Post[],
  users?: User[] | undefined
): PostWithAuthor[] {
  if (!users) return posts.map((p) => ({ ...p, author: null }))
  const map = new Map<number, User>()
  users.forEach((u) => map.set(u.id, u))
  return posts.map((p) => ({ ...p, author: map.get(p.userId) ?? null }))
}

export default attachAuthorsToPosts
