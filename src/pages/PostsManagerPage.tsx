import { useEffect, useState, useCallback, ChangeEvent } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Textarea,
} from "../components"
import PostsList from "../features/post-list/ui/PostsList"
import PostEditor from "../features/post-editor/ui/PostEditor"
import UserModal from "../features/post-user/ui/UserModal"
// 도메인별 타입 임포트

import type { Post, NewPost } from "../entities/post/types"
import type { User } from "../entities/user/types"
import type { Tag } from "../entities/tag/types"
import type { Comment, NewComment } from "../entities/comment/types"

import {
  fetchPosts as apiFetchPosts,
  addPost as apiAddPost,
  updatePost as apiUpdatePost,
  deletePost as apiDeletePost,
  fetchPostsByTag as apiFetchPostsByTag,
  searchPosts as apiSearchPosts,
} from "../entities/post/api"
import { fetchUsers } from "../entities/user/api"
import { fetchTags } from "../entities/tag/api"
import {
  fetchComments as apiFetchComments,
  addComment as apiAddComment,
  updateComment as apiUpdateComment,
  deleteComment as apiDeleteComment,
  likeComment as apiLikeComment,
} from "../entities/comment/api"
import PostDetail from "../features/post-detail/ui/PostDetail"

// 타입 임포트 (최소 필드 기준)

const PostsManager = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  // 상태 관리
  const [posts, setPosts] = useState<Post[]>([])
  const [total, setTotal] = useState(0)
  const [skip, setSkip] = useState(parseInt(queryParams.get("skip") || "0"))
  const [limit, setLimit] = useState(parseInt(queryParams.get("limit") || "10"))
  const [searchQuery, setSearchQuery] = useState(queryParams.get("search") || "")
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [sortBy, setSortBy] = useState(queryParams.get("sortBy") || "")
  const [sortOrder, setSortOrder] = useState(queryParams.get("sortOrder") || "asc")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [newPost, setNewPost] = useState<NewPost>({ title: "", body: "", userId: 1 })
  const [loading, setLoading] = useState(false)
  const [tags, setTags] = useState<Tag[]>([])
  const [selectedTag, setSelectedTag] = useState<string>(queryParams.get("tag") || "")
  const [comments, setComments] = useState<Record<number, Comment[]>>({})
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const [newComment, setNewComment] = useState<NewComment>({ body: "", postId: null, userId: 1 })
  const [showAddCommentDialog, setShowAddCommentDialog] = useState(false)
  const [showEditCommentDialog, setShowEditCommentDialog] = useState(false)
  const [showPostDetailDialog, setShowPostDetailDialog] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)
  const [selectedUser] = useState<User | null>(null)

  // URL 업데이트 함수
  const updateURL = useCallback(() => {
    const params = new URLSearchParams()
    if (skip) params.set("skip", skip.toString())
    if (limit) params.set("limit", limit.toString())
    if (searchQuery) params.set("search", searchQuery)
    if (sortBy) params.set("sortBy", sortBy)
    if (sortOrder) params.set("sortOrder", sortOrder)
    if (selectedTag) params.set("tag", selectedTag)
    navigate(`?${params.toString()}`)
  }, [skip, limit, searchQuery, sortBy, sortOrder, selectedTag, navigate])

  // 게시물 가져오기
  const fetchPosts = useCallback(async () => {
    setLoading(true)
    try {
      const postsData = await apiFetchPosts({ limit, skip })
      const usersData = await fetchUsers()
      const postsWithUsers = postsData.posts.map((post) => ({
        ...post,
        author: usersData.users.find((user) => user.id === post.userId),
      }))
      setPosts(postsWithUsers)
      setTotal(postsData.total)
    } catch (error) {
      console.error("게시물 가져오기 오류:", error)
    }
    setLoading(false)
  }, [limit, skip, setLoading, setPosts, setTotal])

  // 태그 가져오기
  const fetchTagsHandler = async () => {
    try {
      const data = await fetchTags()
      setTags(data)
    } catch (error) {
      console.error("태그 가져오기 오류:", error)
    }
  }

  // 게시물 검색
  const searchPosts = async () => {
    if (!searchQuery) {
      fetchPosts()
      return
    }
    setLoading(true)
    try {
      const data = await apiSearchPosts(searchQuery)
      setPosts(data.posts)
      setTotal(data.total)
    } catch (error) {
      console.error("게시물 검색 오류:", error)
    }
    setLoading(false)
  }

  // 태그별 게시물 가져오기
  // (인터페이스는 컴포넌트 바깥에 정의됨)

  const fetchPostsByTag = useCallback(
    async (tag: string) => {
      if (!tag || tag === "all") {
        fetchPosts()
        return
      }
      setLoading(true)
      try {
        const postsData = await apiFetchPostsByTag(tag)
        const usersData = await fetchUsers()
        const postsWithUsers: Post[] = postsData.posts.map((post) => ({
          ...post,
          author: usersData.users.find((user) => user.id === post.userId),
        }))
        setPosts(postsWithUsers)
        setTotal(postsData.total)
      } catch (error) {
        console.error("태그별 게시물 가져오기 오류:", error)
      }
      setLoading(false)
    },
    [fetchPosts, setLoading, setPosts, setTotal],
  )

  // 게시물 추가
  const addPost = async () => {
    try {
      const data: Post = await apiAddPost(newPost)
      setPosts([data, ...posts])
      setShowAddDialog(false)
      setNewPost({ title: "", body: "", userId: 1 })
    } catch (error) {
      console.error("게시물 추가 오류:", error)
    }
  }

  // 게시물 업데이트
  const updatePost = async () => {
    if (!selectedPost) return
    try {
      const data: Post = await apiUpdatePost(selectedPost)
      setPosts(posts.map((post) => (post.id === data.id ? data : post)))
      setShowEditDialog(false)
    } catch (error) {
      console.error("게시물 업데이트 오류:", error)
    }
  }

  // 게시물 삭제
  const deletePost = async (id: number) => {
    try {
      await apiDeletePost(id)
      setPosts(posts.filter((post) => post.id !== id))
    } catch (error) {
      console.error("게시물 삭제 오류:", error)
    }
  }

  // 댓글 가져오기
  const fetchComments = async (postId: number) => {
    if (postId == null) return
    if (comments[postId]) return
    try {
      const data = await apiFetchComments(postId)
      setComments((prev) => ({ ...prev, [postId]: data }))
    } catch (error) {
      console.error("댓글 가져오기 오류:", error)
    }
  }

  // 댓글 추가
  const addComment = async () => {
    try {
      const data: Comment = await apiAddComment(newComment)
      setComments((prev) => ({
        ...prev,
        [data.postId]: [...(prev[data.postId] || []), data],
      }))
      setShowAddCommentDialog(false)
      setNewComment({ body: "", postId: null, userId: 1 })
    } catch (error) {
      console.error("댓글 추가 오류:", error)
    }
  }

  // 댓글 업데이트
  const updateComment = async () => {
    if (!selectedComment) return
    try {
      const data: Comment = await apiUpdateComment(selectedComment)
      setComments((prev) => ({
        ...prev,
        [data.postId]: prev[data.postId].map((comment) => (comment.id === data.id ? data : comment)),
      }))
      setShowEditCommentDialog(false)
    } catch (error) {
      console.error("댓글 업데이트 오류:", error)
    }
  }

  // 댓글 삭제
  const deleteComment = async (id: number, postId: number) => {
    try {
      await apiDeleteComment(id)
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].filter((comment) => comment.id !== id),
      }))
    } catch (error) {
      console.error("댓글 삭제 오류:", error)
    }
  }

  // 댓글 좋아요
  const likeComment = async (id: number, postId: number) => {
    try {
      const currentLikes = comments[postId]?.find((c) => c.id === id)?.likes ?? 0
      const data: Comment = await apiLikeComment(id, currentLikes + 1)
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].map((comment) => (comment.id === data.id ? data : comment)),
      }))
    } catch (error) {
      console.error("댓글 좋아요 오류:", error)
    }
  }

  // 게시물 상세 보기
  const openPostDetail = (post: Post) => {
    setSelectedPost(post)
    fetchComments(post.id)
    setShowPostDetailDialog(true)
  }

  // 사용자 모달은 `UserModal` 컴포넌트로 처리합니다 (필요 시 selectedUser/setShowUserModal 사용)

  useEffect(() => {
    const fetchTagsAsync = async () => {
      await fetchTagsHandler()
    }
    fetchTagsAsync()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      if (selectedTag) {
        await fetchPostsByTag(selectedTag)
      } else {
        fetchPosts()
      }
      updateURL()
    }
    fetchData()
  }, [skip, limit, sortBy, sortOrder, selectedTag, fetchPosts, fetchPostsByTag, updateURL])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    // defer setState calls slightly to avoid synchronous cascading renders
    const t = setTimeout(() => {
      setSkip(parseInt(params.get("skip") || "0"))
      setLimit(parseInt(params.get("limit") || "10"))
      setSearchQuery(params.get("search") || "")
      setSortBy(params.get("sortBy") || "")
      setSortOrder(params.get("sortOrder") || "asc")
      setSelectedTag(params.get("tag") || "")
    }, 0)
    return () => clearTimeout(t)
  }, [location.search])

  // 하이라이트 함수 추가
  const highlightText = (text: string | undefined, highlight: string) => {
    if (!text) return null
    if (!highlight.trim()) {
      return <span>{text}</span>
    }
    const regex = new RegExp(`(${highlight})`, "gi")
    const parts = text.split(regex)
    return (
      <span>
        {parts.map((part, i) => (regex.test(part) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>))}
      </span>
    )
  }

  // 댓글 상태 전달용 래퍼(CommentsWidget / PostDetail 에서 Partial<Comment>를 전달할 때 사용)
  const setNewCommentForWidget = (c: Partial<Comment>) =>
    setNewComment((prev) => ({ ...prev, ...(c as unknown as Partial<NewComment>) }))

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>게시물 관리자</span>
          <Button onClick={() => setShowAddDialog(true)}>게시물 추가</Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <PostsList
          posts={posts}
          loading={loading}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchPosts={searchPosts}
          tags={tags}
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
          fetchPostsByTag={fetchPostsByTag}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          limit={limit}
          setLimit={setLimit}
          skip={skip}
          setSkip={setSkip}
          total={total}
          openPostDetail={openPostDetail}
          setSelectedPost={setSelectedPost}
          setShowEditDialog={setShowEditDialog}
          deletePost={deletePost}
          updateURL={updateURL}
        />
      </CardContent>

      <PostEditor
        showAddDialog={showAddDialog}
        setShowAddDialog={setShowAddDialog}
        newPost={newPost}
        setNewPost={setNewPost}
        addPost={addPost}
        showEditDialog={showEditDialog}
        setShowEditDialog={setShowEditDialog}
        selectedPost={selectedPost}
        setSelectedPost={setSelectedPost}
        updatePost={updatePost}
      />

      {/* 게시물 수정 대화상자 */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>게시물 수정</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="제목"
              value={selectedPost?.title || ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setSelectedPost((prev) => (prev ? { ...prev, title: e.target.value } : prev))
              }
            />
            <Textarea
              rows={15}
              placeholder="내용"
              value={selectedPost?.body || ""}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setSelectedPost((prev) => (prev ? { ...prev, body: e.target.value } : prev))
              }
            />
            <Button onClick={updatePost}>게시물 업데이트</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 댓글 추가 대화상자 */}
      <Dialog open={showAddCommentDialog} onOpenChange={setShowAddCommentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>새 댓글 추가</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="댓글 내용"
              value={newComment.body}
              onChange={(e) => setNewComment({ ...newComment, body: e.target.value })}
            />
            <Button onClick={addComment}>댓글 추가</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 댓글 수정 대화상자 */}
      <Dialog open={showEditCommentDialog} onOpenChange={setShowEditCommentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>댓글 수정</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="댓글 내용"
              value={selectedComment?.body || ""}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setSelectedComment((prev) => (prev ? { ...prev, body: e.target.value } : prev))
              }
            />
            <Button onClick={updateComment}>댓글 업데이트</Button>
          </div>
        </DialogContent>
      </Dialog>

      <PostDetail
        selectedPost={selectedPost}
        showPostDetailDialog={showPostDetailDialog}
        setShowPostDetailDialog={setShowPostDetailDialog}
        comments={comments}
        setNewComment={setNewCommentForWidget}
        setShowAddCommentDialog={setShowAddCommentDialog}
        likeComment={likeComment}
        setSelectedComment={setSelectedComment}
        setShowEditCommentDialog={setShowEditCommentDialog}
        deleteComment={deleteComment}
        searchQuery={searchQuery}
        highlightText={highlightText}
      />

      <UserModal selectedUser={selectedUser} showUserModal={showUserModal} setShowUserModal={setShowUserModal} />
    </Card>
  )
}

export default PostsManager
