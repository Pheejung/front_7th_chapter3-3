import { User } from "../user/types"

export interface Comment {
  id: number
  body: string
  postId: number
  user: User
  likes?: number
}

export interface NewComment {
  body: string
  postId: number | null
  userId: number
}
