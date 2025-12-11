import type { Post, PostsResponse, NewPost } from "./types"
import { apiClient } from "../../shared/lib/fetch"

export async function fetchPosts(params: { limit: number; skip: number }): Promise<PostsResponse> {
  return apiClient(`/api/posts?limit=${params.limit}&skip=${params.skip}`)
}

export async function fetchPostsByTag(tag: string): Promise<PostsResponse> {
  return apiClient(`/api/posts/tag/${tag}`)
}

export async function searchPosts(query: string): Promise<PostsResponse> {
  return apiClient(`/api/posts/search?q=${query}`)
}

export async function addPost(newPost: NewPost): Promise<Post> {
  return apiClient(`/api/posts/add`, {
    method: "POST",
    body: JSON.stringify(newPost),
  })
}

export async function updatePost(post: Post): Promise<Post> {
  return apiClient(`/api/posts/${post.id}`, {
    method: "PUT",
    body: JSON.stringify(post),
  })
}

export async function deletePost(id: number): Promise<void> {
  await apiClient(`/api/posts/${id}`, { method: "DELETE" })
}
