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
} from "../../components"
import PostEditor from "../../features/post-editor/ui/PostEditor"

import type { Post, NewPost } from "../../entities/post/types"
import type { User } from "../../entities/user/types"
import type { Tag } from "../../entities/tag/types"
import type { Comment, NewComment } from "../../entities/comment/types"

import { addPost as apiAddPost, updatePost as apiUpdatePost, deletePost as apiDeletePost } from "../../entities/post/api"
import { fetchTags } from "../../entities/tag/api"
import highlightText from "../../shared/lib/highlight"
// attachAuthorsToPosts and user fetching moved into usePosts hook
import { useToggle } from "../../shared/hooks/useToggle"
import usePosts from "./hooks/usePosts"
import PostsControls from "./components/PostsControls"
import useComments from "./hooks/useComments"
import PostDetail from "../../features/post-detail/ui/PostDetail"
import PostsList from "../../features/post-list/ui/PostsList"
import UserModal from "../../features/user/ui/UserModal"

const PostsWidget = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  const initialSkip = parseInt(queryParams.get("skip") || "0")
  const initialLimit = parseInt(queryParams.get("limit") || "10")
  const {
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
  } = usePosts({ initialSkip, initialLimit, initialSearch: queryParams.get("search") || "", initialTag: queryParams.get("tag") || "" })
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [sortBy, setSortBy] = useState(queryParams.get("sortBy") || "")
  const [sortOrder, setSortOrder] = useState(queryParams.get("sortOrder") || "asc")
  const [showAddDialog, setShowAddDialog] = useToggle(false)
  const [showEditDialog, setShowEditDialog] = useToggle(false)
  const [newPost, setNewPost] = useState<NewPost>({ title: "", body: "", userId: 1 })
  const [tags, setTags] = useState<Tag[]>([])
  // selectedTag is managed by usePosts hook
  const { comments, fetchComments, addComment: addCommentHook, updateComment: updateCommentHook, deleteComment: deleteCommentHook, likeComment: likeCommentHook } = useComments()
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const [newComment, setNewComment] = useState<NewComment>({ body: "", postId: null, userId: 1 })
  const [showAddCommentDialog, setShowAddCommentDialog] = useToggle(false)
  const [showEditCommentDialog, setShowEditCommentDialog] = useToggle(false)
  const [showPostDetailDialog, setShowPostDetailDialog] = useToggle(false)
  const [showUserModal, setShowUserModal] = useToggle(false)
  const [selectedUser] = useState<User | null>(null)

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

  // posts fetching/search/tag/pagination moved to usePosts hook

  const fetchTagsHandler = async () => {
    try {
      const data = await fetchTags()
      setTags(data)
    } catch (error) {
      console.error("태그 가져오기 오류:", error)
    }
  }

  const searchPostsHandler = () => {
    return searchPosts(searchQuery)
  }

  // fetchPostsByTag from hook is passed directly where needed

  const addPost = async () => {
    try {
      await apiAddPost(newPost)
      // refetch after mutation
      await fetchPosts()
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
      await fetchPosts()
      setShowEditDialog(false)
    } catch (error) {
      console.error("게시물 업데이트 오류:", error)
    }
  }

  const deletePost = async (id: number) => {
    try {
      await apiDeletePost(id)
      await fetchPosts()
    } catch (error) {
      console.error("게시물 삭제 오류:", error)
    }
  }

  // comment methods provided by useComments hook; we wrap to integrate local dialog state
  const addComment = async () => {
    try {
      await addCommentHook(newComment)
      setShowAddCommentDialog(false)
      setNewComment({ body: "", postId: null, userId: 1 })
    } catch (error) {
      console.error("댓글 추가 오류:", error)
    }
  }

  const updateComment = async () => {
    if (!selectedComment) return
    try {
      await updateCommentHook(selectedComment)
      setShowEditCommentDialog(false)
    } catch (error) {
      console.error("댓글 업데이트 오류:", error)
    }
  }

  const deleteComment = async (id: number, postId: number) => {
    try {
      await deleteCommentHook(id, postId)
    } catch (error) {
      console.error("댓글 삭제 오류:", error)
    }
  }

  const likeComment = async (id: number, postId: number) => {
    try {
      const currentLikes = comments[postId]?.find((c) => c.id === id)?.likes ?? 0
      await likeCommentHook(id, postId, currentLikes + 1)
    } catch (error) {
      console.error("댓글 좋아요 오류:", error)
    }
  }

  const openPostDetail = (post: Post) => {
    setSelectedPost(post)
    fetchComments(post.id)
    setShowPostDetailDialog(true)
  }

  const setNewCommentForWidget = (c: Partial<Comment>) => setNewComment((prev) => ({ ...prev, ...(c as Partial<NewComment>) }))

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
    const t = setTimeout(() => {
      setSkip(parseInt(params.get("skip") || "0"))
      setLimit(parseInt(params.get("limit") || "10"))
      setSearchQuery(params.get("search") || "")
      setSortBy(params.get("sortBy") || "")
      setSortOrder(params.get("sortOrder") || "asc")
      setSelectedTag(params.get("tag") || "")
    }, 0)
    return () => clearTimeout(t)
  }, [location.search, setSkip, setLimit])

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>게시물 관리자</span>
          <Button onClick={() => setShowAddDialog(true)}>게시물 추가</Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <PostsControls
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearch={searchPostsHandler}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
          skip={skip}
          limit={limit}
          setSkip={setSkip}
          setLimit={setLimit}
          total={total}
        />
        <PostsList
          posts={posts}
          loading={loading}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchPosts={searchPostsHandler}
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

      <Dialog open={showAddCommentDialog} onOpenChange={setShowAddCommentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>새 댓글 추가</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea placeholder="댓글 내용" value={newComment.body} onChange={(e) => setNewComment({ ...newComment, body: e.target.value })} />
            <Button onClick={addComment}>댓글 추가</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditCommentDialog} onOpenChange={setShowEditCommentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>댓글 수정</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="댓글 내용"
              value={selectedComment?.body || ""}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setSelectedComment((prev) => (prev ? { ...prev, body: e.target.value } : prev))}
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

export default PostsWidget