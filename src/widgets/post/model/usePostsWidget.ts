import { useEffect } from "react"

// Features
import { usePosts } from "../../../features/post-list/model"
import { usePostsMutation } from "../../../features/post-list/model/usePostsMutation"
import useComments from "../../../features/post-comments/model/useComments"

// Managers (기존 로직 유지)
import { usePostsManager } from "./usePostsManager"

// Utils
import { useUrlManager } from "./useUrlManager"
import type { Post } from "../../../entities/post/types"

/**
 * PostsWidget - Features와 Managers를 조합
 * 점진적으로 FSD 구조로 개선 예정
 */
export const usePostsWidget = () => {
  // === MANAGERS ===
  const postsManager = usePostsManager()

  // === FEATURES ===
  const postsFeature = usePosts({
    initialSkip: 0,
    initialLimit: 10,
    searchQuery: "",
    selectedTag: "all",
  })

  const postsMutation = usePostsMutation()

  const commentsFeature = useComments(postsManager.selectedPost?.id ?? null)

  // === UTILS ===
  const { updateURL, parseURLParams } = useUrlManager()

  // === EFFECTS ===
  useEffect(() => {
    const params = parseURLParams()
    postsManager.setSkip(params.skip)
    postsManager.setLimit(params.limit)
    postsManager.setSearchQuery(params.searchQuery)
    postsManager.setSortBy(params.sortBy)
    postsManager.setSortOrder(params.sortOrder)
    postsManager.setSelectedTag(params.selectedTag)
  }, [parseURLParams, postsManager])

  useEffect(() => {
    const fetchTagsAsync = async () => {
      await postsManager.fetchTagsHandler()
    }
    fetchTagsAsync()
  }, [postsManager])

  // === ACTIONS ===
  const openPostDetail = (post: Post) => {
    postsManager.openPostDetail(post)
    // Note: UI state management moved to component level for FSD compliance
  }

  const handleUpdateURL = () => {
    updateURL({
      skip: postsManager.skip,
      limit: postsManager.limit,
      searchQuery: postsManager.searchQuery,
      sortBy: postsManager.sortBy,
      sortOrder: postsManager.sortOrder,
      selectedTag: postsManager.selectedTag,
    })
  }

  return {
    // Posts data (from features + managers)
    posts: postsFeature.posts,
    total: postsFeature.total,
    loading: postsFeature.loading,
    skip: postsManager.skip,
    limit: postsManager.limit,
    setSkip: postsManager.setSkip,
    setLimit: postsManager.setLimit,

    // Search & Filter
    searchQuery: postsManager.searchQuery,
    setSearchQuery: postsManager.setSearchQuery,
    selectedTag: postsManager.selectedTag,
    setSelectedTag: postsManager.setSelectedTag,
    sortBy: postsManager.sortBy,
    setSortBy: postsManager.setSortBy,
    sortOrder: postsManager.sortOrder,
    setSortOrder: postsManager.setSortOrder,

    // Tags
    tags: postsManager.tags,

    // Post dialogs
    showAddDialog: postsManager.showAddDialog,
    setShowAddDialog: postsManager.setShowAddDialog,
    showEditDialog: postsManager.showEditDialog,
    setShowEditDialog: postsManager.setShowEditDialog,
    selectedPost: postsManager.selectedPost,
    setSelectedPost: postsManager.setSelectedPost,

    // Post operations (from features)
    newPost: postsManager.newPost,
    setNewPost: postsManager.setNewPost,
    addPost: postsMutation.addPost,
    updatePost: postsMutation.updatePost,
    deletePost: postsMutation.deletePost,

    // Comments (from features)
    comments: postsManager.selectedPost?.id ? commentsFeature.comments[postsManager.selectedPost.id] || [] : [],
    addComment: commentsFeature.addComment,
    updateComment: commentsFeature.updateComment,
    deleteComment: commentsFeature.deleteComment,

    // Actions
    openPostDetail,
    updateURL: handleUpdateURL,
  }
}
