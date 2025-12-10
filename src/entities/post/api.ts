import type { Post, PostsResponse, NewPost } from "./types"

export async function fetchPosts(params: { limit: number; skip: number }): Promise<PostsResponse> {
  const res = await fetch(`/api/posts?limit=${params.limit}&skip=${params.skip}`)
  return res.json()
}

export async function fetchPostsByTag(tag: string): Promise<PostsResponse> {
  const res = await fetch(`/api/posts/tag/${tag}`)
  return res.json()
}

export async function searchPosts(query: string): Promise<PostsResponse> {
  const res = await fetch(`/api/posts/search?q=${query}`)
  return res.json()
}

export async function addPost(newPost: NewPost): Promise<Post> {
  const res = await fetch("/api/posts/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newPost),
  })
  return res.json()
}

export async function updatePost(post: Post): Promise<Post> {
  const res = await fetch(`/api/posts/${post.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(post),
  })
  return res.json()
}

export async function deletePost(id: number): Promise<void> {
  await fetch(`/api/posts/${id}`, { method: "DELETE" })
}
