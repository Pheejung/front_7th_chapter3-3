import { User } from "../user/types"

// 도메인별 타입 import
export interface Post {
  id: number
  title: string
  body: string
  userId: number
  tags?: string[]
  reactions?: {
    likes?: number
    dislikes?: number
  }
  author?: User | null
}

export interface PostsResponse {
  posts: Post[]
  total: number
}

export interface NewPost {
  title: string
  body: string
  userId: number
}

export interface NewComment {
  body: string
  postId: number | null
  userId: number
}
