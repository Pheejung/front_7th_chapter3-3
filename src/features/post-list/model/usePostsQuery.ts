import { useQuery } from "@tanstack/react-query"
import {
  fetchPosts as apiFetchPosts,
  fetchPostsByTag as apiFetchPostsByTag,
  searchPosts as apiSearchPosts,
} from "../../../entities/post/api"
import { fetchUsers } from "../../../entities/user/api"
import { attachAuthorsToPosts } from "../../../features/post-list/model"
import { queryKeys } from "../../../shared/lib/queryKeys"

type QueryParams = {
  skip: number
  limit: number
  searchQuery?: string
  selectedTag?: string
}

export function usePostsQuery({ skip, limit, searchQuery = "", selectedTag = "" }: QueryParams) {
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
    enabled: !searchQuery && !selectedTag,
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
    enabled: !!selectedTag,
  })

  const posts = postsData?.posts || searchData?.posts || tagData?.posts || []
  const total = postsData?.total || searchData?.total || tagData?.total || 0

  return {
    posts,
    total,
    loading: loading || searchLoading || tagLoading,
  }
}
