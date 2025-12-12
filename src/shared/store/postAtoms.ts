import { atom } from "jotai"
import type { Post, NewPost } from "@/entities/post/types"
import type { Tag } from "@/entities/tag/types"
import type { Comment, NewComment } from "@/entities/comment/types"
import type { User } from "@/entities/user/types"

// Post related atoms
export const selectedPostAtom = atom<Post | null>(null)
export const sortByAtom = atom<string>("")
export const sortOrderAtom = atom<string>("asc")
export const newPostAtom = atom<NewPost>({ title: "", body: "", userId: 1 })
export const tagsAtom = atom<Tag[]>([])
export const searchQueryAtom = atom<string>("")
export const selectedTagAtom = atom<string>("")
// Comment related atoms
export const selectedCommentAtom = atom<Comment | null>(null)
export const newCommentAtom = atom<NewComment>({ body: "", postId: 0, userId: 1 })

// User related atoms
export const selectedUserAtom = atom<User | null>(null)
