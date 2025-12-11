import type { Comment, NewComment } from "./types"
import { apiClient } from "../../shared/lib/fetch"

export async function fetchComments(postId: number): Promise<Comment[]> {
  const data = await apiClient(`/api/comments/post/${postId}`)
  return data.comments
}

export async function addComment(newComment: NewComment): Promise<Comment> {
  return apiClient(`/api/comments/add`, { method: "POST", body: JSON.stringify(newComment) })
}

export async function updateComment(comment: Comment): Promise<Comment> {
  return apiClient(`/api/comments/${comment.id}`, { method: "PUT", body: JSON.stringify({ body: comment.body }) })
}

export async function deleteComment(id: number): Promise<void> {
  await apiClient(`/api/comments/${id}`, { method: "DELETE" })
}

export async function likeComment(id: number, likes: number): Promise<Comment> {
  return apiClient(`/api/comments/${id}`, { method: "PATCH", body: JSON.stringify({ likes }) })
}
