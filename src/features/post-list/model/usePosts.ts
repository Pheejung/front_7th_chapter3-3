import { usePostsQuery } from "./usePostsQuery"
import { usePostsMutation } from "./usePostsMutation"
import usePagination from "../../../shared/hooks/usePagination"

type Params = {
  initialSkip?: number
  initialLimit?: number
  searchQuery?: string
  selectedTag?: string
}

export default function usePosts({ initialSkip = 0, initialLimit = 10, searchQuery = "", selectedTag = "" }: Params) {
  const { skip, limit, setSkip, setLimit } = usePagination(initialSkip, initialLimit)

  const { posts, total, loading } = usePostsQuery({
    skip,
    limit,
    searchQuery,
    selectedTag,
  })

  const { addPost, updatePost, deletePost } = usePostsMutation()

  return {
    posts,
    total,
    loading,
    skip,
    limit,
    setSkip,
    setLimit,
    addPost,
    updatePost,
    deletePost,
  }
}
