import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  fetchPosts as apiFetchPosts,
  fetchPostsByTag as apiFetchPostsByTag,
  searchPosts as apiSearchPosts,
  addPost as apiAddPost,
  updatePost as apiUpdatePost,
  deletePost as apiDeletePost,
} from "../../../entities/post/api"
import { fetchUsers } from "../../../entities/user/api"
import { attachAuthorsToPosts } from "../../../features/post-list/model"
import usePagination from "../../../shared/hooks/usePagination"
import { queryKeys } from "../../../shared/lib/queryKeys"

type Params = {
  initialSkip?: number
  initialLimit?: number
  searchQuery?: string
  selectedTag?: string
}

export default function usePosts({ initialSkip = 0, initialLimit = 10, searchQuery = "", selectedTag = "" }: Params) {
  const { skip, limit, setSkip, setLimit } = usePagination(initialSkip, initialLimit)
  const queryClient = useQueryClient()

  // Posts query
  const { data: postsData, isLoading: loading } = useQuery({
    queryKey: queryKeys.posts,
    queryFn: async () => {
      const postsResponse = await apiFetchPosts({ limit, skip })
      const usersResponse = await fetchUsers()
      return {
        posts: attachAuthorsToPosts(postsResponse.posts, usersResponse.users),
        total: postsResponse.total,
      }
    },
    enabled: !searchQuery && (!selectedTag || selectedTag === "all"),
  })

  // Search posts query
  const { data: searchData, isLoading: searchLoading } = useQuery({
    queryKey: queryKeys.searchPosts(searchQuery),
    queryFn: async () => {
      const postsResponse = await apiSearchPosts(searchQuery)
      const usersResponse = await fetchUsers()
      return {
        posts: attachAuthorsToPosts(postsResponse.posts, usersResponse.users),
        total: postsResponse.total,
      }
    },
    enabled: !!searchQuery,
  })

  // Posts by tag query
  const { data: tagData, isLoading: tagLoading } = useQuery({
    queryKey: queryKeys.postsByTag(selectedTag),
    queryFn: async () => {
      const postsResponse = await apiFetchPostsByTag(selectedTag)
      const usersResponse = await fetchUsers()
      return {
        posts: attachAuthorsToPosts(postsResponse.posts, usersResponse.users),
        total: postsResponse.total,
      }
    },
    enabled: !!selectedTag && selectedTag !== "all",
  })

  const posts = postsData?.posts || searchData?.posts || tagData?.posts || []
  const total = postsData?.total || searchData?.total || tagData?.total || 0

  // Mutations
  const addPostMutation = useMutation({
    mutationFn: apiAddPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts })
    },
  })

  const updatePostMutation = useMutation({
    mutationFn: apiUpdatePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts })
    },
  })

  const deletePostMutation = useMutation({
    mutationFn: apiDeletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts })
    },
  })

  return {
    posts,
    total,
    loading: loading || searchLoading || tagLoading,
    skip,
    limit,
    setSkip,
    setLimit,
    addPost: addPostMutation.mutateAsync,
    updatePost: updatePostMutation.mutateAsync,
    deletePost: deletePostMutation.mutateAsync,
  }
}
