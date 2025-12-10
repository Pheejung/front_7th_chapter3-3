import type { Comment, NewComment } from "./types"

export async function fetchComments(postId: number): Promise<Comment[]> {
  const res = await fetch(`/api/comments/post/${postId}`)
  const data = await res.json()
  return data.comments
}

export async function addComment(newComment: NewComment): Promise<Comment> {
  const res = await fetch("/api/comments/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newComment),
  })
  return res.json()
}

export async function updateComment(comment: Comment): Promise<Comment> {
  const res = await fetch(`/api/comments/${comment.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ body: comment.body }),
  })
  return res.json()
}

export async function deleteComment(id: number): Promise<void> {
  await fetch(`/api/comments/${id}`, { method: "DELETE" })
}

export async function likeComment(id: number, likes: number): Promise<Comment> {
  const res = await fetch(`/api/comments/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ likes }),
  })
  return res.json()
}
