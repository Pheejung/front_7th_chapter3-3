import { Button, Card, CardContent, CardHeader, CardTitle } from "@/shared/ui"
import PostEditor from "../../../features/post-editor"
import PostsControls from "./PostsControls"
import PostsDialogs from "./PostsDialogs"
import PostsList from "../../../features/post-list"
import { usePostsWidget } from "../model/usePostsWidget"

export default function PostsWidgetView() {
  const {
    posts,
    total,
    loading,
    comments,
    tags,
    searchQuery,
    selectedTag,
    sortBy,
    sortOrder,
    skip,
    limit,
    selectedPost,
    selectedComment,
    newPost,
    newComment,
    selectedUser,
    showAddDialog,
    showEditDialog,
    showAddCommentDialog,
    showEditCommentDialog,
    showPostDetailDialog,
    showUserModal,
    setSearchQuery,
    setSelectedTag,
    setSortBy,
    setSortOrder,
    setSkip,
    setLimit,
    setSelectedPost,
    setSelectedComment,
    setNewPost,
    setNewComment,
    setShowAddDialog,
    setShowEditDialog,
    setShowAddCommentDialog,
    setShowEditCommentDialog,
    setShowPostDetailDialog,
    setShowUserModal,
    addPost,
    updatePost,
    deletePost,
    addComment,
    updateComment,
    deleteComment,
    openPostDetail,
    setNewCommentForWidget,
    updateURL,
  } = usePostsWidget()
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
          tags={tags}
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
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

      <PostsDialogs
        selectedPost={selectedPost}
        showEditDialog={showEditDialog}
        setShowEditDialog={setShowEditDialog}
        updatePost={updatePost}
        setSelectedPost={setSelectedPost}
        showAddCommentDialog={showAddCommentDialog}
        setShowAddCommentDialog={setShowAddCommentDialog}
        showEditCommentDialog={showEditCommentDialog}
        setShowEditCommentDialog={setShowEditCommentDialog}
        showPostDetailDialog={showPostDetailDialog}
        setShowPostDetailDialog={setShowPostDetailDialog}
        comments={comments}
        newComment={newComment}
        setNewComment={setNewComment}
        selectedComment={selectedComment}
        setSelectedComment={setSelectedComment}
        addComment={addComment}
        updateComment={updateComment}
        deleteComment={deleteComment}
        setNewCommentForWidget={setNewCommentForWidget}
        searchQuery={searchQuery}
        showUserModal={showUserModal}
        setShowUserModal={setShowUserModal}
        selectedUser={selectedUser}
      />
    </Card>
  )
}
