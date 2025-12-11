import { useCallback, useState } from "react"
import type { Comment, NewComment } from "../../../entities/comment/types"
import {
  fetchComments as apiFetchComments,
  addComment as apiAddComment,
  updateComment as apiUpdateComment,
  deleteComment as apiDeleteComment,
  likeComment as apiLikeComment,
} from "../../../entities/comment/api"

export default function useComments() {
  const [comments, setComments] = useState<Record<number, Comment[]>>({})

  const fetchComments = useCallback(async (postId: number) => {
    if (postId == null) return
    if (comments[postId]) return
    try {
      const data = await apiFetchComments(postId)
      setComments((prev) => ({ ...prev, [postId]: data }))
    } catch (error) {
      console.error("댓글 가져오기 오류:", error)
    }
  }, [comments])

  const addComment = useCallback(async (newComment: NewComment) => {
    try {
      const data: Comment = await apiAddComment(newComment)
      setComments((prev) => ({ ...prev, [data.postId]: [...(prev[data.postId] || []), data] }))
      return data
    } catch (error) {
      console.error("댓글 추가 오류:", error)
      throw error
    }
  }, [])

  const updateComment = useCallback(async (comment: Comment) => {
    try {
      const data: Comment = await apiUpdateComment(comment)
      setComments((prev) => ({ ...prev, [data.postId]: prev[data.postId].map((c) => (c.id === data.id ? data : c)) }))
      return data
    } catch (error) {
      console.error("댓글 업데이트 오류:", error)
      throw error
    }
  }, [])

  const deleteComment = useCallback(async (id: number, postId: number) => {
    try {
      await apiDeleteComment(id)
      setComments((prev) => ({ ...prev, [postId]: prev[postId].filter((comment) => comment.id !== id) }))
    } catch (error) {
      console.error("댓글 삭제 오류:", error)
      throw error
    }
  }, [])

  const likeComment = useCallback(async (id: number, postId: number, likes: number) => {
    try {
      const data: Comment = await apiLikeComment(id, likes)
      setComments((prev) => ({ ...prev, [postId]: prev[postId].map((comment) => (comment.id === data.id ? data : comment)) }))
      return data
    } catch (error) {
      console.error("댓글 좋아요 오류:", error)
      throw error
    }
  }, [])

  return {
    comments,
    fetchComments,
    addComment,
    updateComment,
    deleteComment,
    likeComment,
    setComments,
  }
}
