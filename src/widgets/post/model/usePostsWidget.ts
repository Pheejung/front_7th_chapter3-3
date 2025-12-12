import { useEffect } from "react"
import { usePostsManager } from "./usePostsManager"
import { useCommentsManager } from "./useCommentsManager"
import { useUrlManager } from "./useUrlManager"
import type { Post } from "../../../entities/post/types"

export const usePostsWidget = () => {
  const postsManager = usePostsManager()
  const commentsManager = useCommentsManager(postsManager.selectedPost?.id ?? null)
  const { updateURL, parseURLParams } = useUrlManager()

  // URL 파라미터를 상태에 반영
  useEffect(() => {
    const params = parseURLParams()
    postsManager.setSkip(params.skip)
    postsManager.setLimit(params.limit)
    postsManager.setSearchQuery(params.searchQuery)
    postsManager.setSortBy(params.sortBy)
    postsManager.setSortOrder(params.sortOrder)
    postsManager.setSelectedTag(params.selectedTag)
  }, [parseURLParams, postsManager])

  // 태그 초기 로딩
  useEffect(() => {
    const fetchTagsAsync = async () => {
      await postsManager.fetchTagsHandler()
    }
    fetchTagsAsync()
  }, [postsManager])

  // openPostDetail을 수정해서 postDetailDialog도 열기
  const openPostDetail = (post: Post) => {
    postsManager.openPostDetail(post)
    commentsManager.setShowPostDetailDialog(true)
  }

  // URL 업데이트 함수
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
    // Posts data & actions
    ...postsManager,

    // Comments data & actions
    ...commentsManager,

    // URL management
    updateURL: handleUpdateURL,

    // Modified actions
    openPostDetail,
  }
}
