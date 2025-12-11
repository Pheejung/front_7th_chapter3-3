import { useCallback, useEffect, useState } from "react"
import { fetchPosts as apiFetchPosts, fetchPostsByTag as apiFetchPostsByTag, searchPosts as apiSearchPosts } from "../../../entities/post/api"
import { fetchUsers } from "../../../entities/user/api"
import { attachAuthorsToPosts } from "../../../features/post-list/model"
import usePagination from "../../../shared/hooks/usePagination"

type Params = {
  initialSkip?: number
  initialLimit?: number
  initialSearch?: string
  initialTag?: string
}

export default function usePosts({ initialSkip = 0, initialLimit = 10, initialSearch = "", initialTag = "" }: Params) {
  const { skip, limit, setSkip, setLimit } = usePagination(initialSkip, initialLimit)
  const [posts, setPosts] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [selectedTag, setSelectedTag] = useState(initialTag)

  const fetchPosts = useCallback(async () => {
    setLoading(true)
    try {
      const postsData = await apiFetchPosts({ limit, skip })
      const usersData = await fetchUsers()
      const postsWithUsers = attachAuthorsToPosts(postsData.posts, usersData.users)
      setPosts(postsWithUsers)
      setTotal(postsData.total)
    } catch (err) {
      console.error("usePosts fetchPosts error", err)
    }
    setLoading(false)
  }, [limit, skip])

  const searchPosts = useCallback(
    async (query: string) => {
      setLoading(true)
      try {
        if (!query) {
          await fetchPosts()
          return
        }
        const data = await apiSearchPosts(query)
        setPosts(data.posts)
        setTotal(data.total)
      } catch (err) {
        console.error("usePosts searchPosts error", err)
      }
      setLoading(false)
    },
    [fetchPosts],
  )

  const fetchPostsByTag = useCallback(
    async (tag: string) => {
      setLoading(true)
      try {
        if (!tag || tag === "all") {
          await fetchPosts()
          return
        }
        const postsData = await apiFetchPostsByTag(tag)
        const usersData = await fetchUsers()
        const postsWithUsers = attachAuthorsToPosts(postsData.posts, usersData.users)
        setPosts(postsWithUsers)
        setTotal(postsData.total)
      } catch (err) {
        console.error("usePosts fetchPostsByTag error", err)
      }
      setLoading(false)
    },
    [fetchPosts],
  )

  // initial load and when skip/limit change
  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  // expose a minimal API
  return {
    posts,
    total,
    loading,
    searchQuery,
    setSearchQuery,
    selectedTag,
    setSelectedTag,
    fetchPosts,
    searchPosts,
    fetchPostsByTag,
    skip,
    limit,
    setSkip,
    setLimit,
  }
}
