import { useAtom } from "jotai"
import {
  selectedPostAtom,
  sortByAtom,
  sortOrderAtom,
  newPostAtom,
  tagsAtom,
  searchQueryAtom,
  selectedTagAtom,
} from "../../../shared/store/postAtoms"
import { useToggle } from "../../../shared/hooks/useToggle"
import { usePosts } from "../../../features/post-list/model"
import { fetchTags } from "../../../entities/tag/api"
import {
  addPost as apiAddPost,
  updatePost as apiUpdatePost,
  deletePost as apiDeletePost,
} from "../../../entities/post/api"
import type { Post } from "../../../entities/post/types"

export const usePostsManager = () => {
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom)
  const [selectedTag, setSelectedTag] = useAtom(selectedTagAtom)
  const { posts, total, loading, skip, limit, setSkip, setLimit } = usePosts({
    initialSkip: 0,
    initialLimit: 10,
    searchQuery,
    selectedTag,
  })

  const [selectedPost, setSelectedPost] = useAtom(selectedPostAtom)
  const [sortBy, setSortBy] = useAtom(sortByAtom)
  const [sortOrder, setSortOrder] = useAtom(sortOrderAtom)
  const [showAddDialog, setShowAddDialog] = useToggle(false)
  const [showEditDialog, setShowEditDialog] = useToggle(false)
  const [newPost, setNewPost] = useAtom(newPostAtom)
  const [tags, setTags] = useAtom(tagsAtom)

  const fetchTagsHandler = async () => {
    try {
      const data = await fetchTags()
      setTags(data)
    } catch (error) {
      console.error("태그 가져오기 오류:", error)
    }
  }

  const addPost = async () => {
    try {
      await apiAddPost(newPost)
      setShowAddDialog(false)
      setNewPost({ title: "", body: "", userId: 1 })
    } catch (error) {
      console.error("게시물 추가 오류:", error)
    }
  }

  const updatePost = async () => {
    if (!selectedPost) return
    try {
      await apiUpdatePost(selectedPost)
      setShowEditDialog(false)
    } catch (error) {
      console.error("게시물 업데이트 오류:", error)
    }
  }

  const deletePost = async (id: number) => {
    try {
      await apiDeletePost(id)
    } catch (error) {
      console.error("게시물 삭제 오류:", error)
    }
  }

  const openPostDetail = (post: Post) => {
    setSelectedPost(post)
  }

  return {
    // Data
    posts,
    total,
    loading,
    tags,
    searchQuery,
    selectedTag,
    sortBy,
    sortOrder,
    skip,
    limit,
    selectedPost,
    newPost,

    // UI State
    showAddDialog,
    showEditDialog,

    // Setters
    setSearchQuery,
    setSelectedTag,
    setSortBy,
    setSortOrder,
    setSkip,
    setLimit,
    setSelectedPost,
    setNewPost,
    setShowAddDialog,
    setShowEditDialog,

    // Actions
    addPost,
    updatePost,
    deletePost,
    openPostDetail,
    fetchTagsHandler,
  }
}
