import { useState } from "react"
import { addPost, updatePost } from "../../../entities/post/api"
import type { NewPost, Post } from "../../../entities/post/types"

/**
 * Post Editor Feature의 비즈니스 로직
 * 게시물 추가/수정 기능을 담당
 */
export function usePostEditor() {
  const [newPost, setNewPost] = useState<NewPost>({ title: "", body: "", userId: 1 })
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const createPost = async (postData: NewPost) => {
    setIsSubmitting(true)
    try {
      const createdPost = await addPost(postData)
      setNewPost({ title: "", body: "", userId: 1 }) // 초기화
      return createdPost
    } catch (error) {
      console.error("게시물 생성 오류:", error)
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  const updatePostData = async (post: Post) => {
    setIsSubmitting(true)
    try {
      const updatedPost = await updatePost(post)
      return updatedPost
    } catch (error) {
      console.error("게시물 수정 오류:", error)
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setNewPost({ title: "", body: "", userId: 1 })
    setSelectedPost(null)
  }

  return {
    // State
    newPost,
    setNewPost,
    selectedPost,
    setSelectedPost,
    isSubmitting,

    // Actions
    createPost,
    updatePostData,
    resetForm,
  }
}
