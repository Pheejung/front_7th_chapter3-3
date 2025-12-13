import { Card } from "@/shared/ui"
import { PostAddDialog, PostEditDialog } from "../../../features/post-editor"
import CommentDialogs from "../../../features/post-comments/ui/CommentDialogs"
import PostDetailWithComments from "./PostDetailWithComments"
import UserModal from "../../../features/user/ui/UserModal"
import PostsWidgetHeader from "./PostsWidgetHeader"
import PostsWidgetContent from "./PostsWidgetContent"
import { usePostsWidget } from "../model/usePostsWidget"
import { highlightText } from "../../../shared/lib/highlight"

export default function PostsWidgetView() {
  const {
    showAddDialog,
    setShowAddDialog,
    newPost,
    setNewPost,
    addPost,
    updatePost,
    showEditDialog,
    setShowEditDialog,
    selectedPost,
    setSelectedPost,
  } = usePostsWidget()

  // UI State (component level for FSD compliance)
  // Dialog states are now managed by atoms in individual components

  const handleAddPost = async () => {
    try {
      await addPost(newPost)
      setShowAddDialog(false)
      setNewPost({ title: "", body: "", userId: 1 })
    } catch (error) {
      console.error("게시물 추가 오류:", error)
    }
  }

  const handleUpdatePost = async () => {
    if (!selectedPost) return
    try {
      await updatePost(selectedPost)
      setShowEditDialog(false)
    } catch (error) {
      console.error("게시물 업데이트 오류:", error)
    }
  }
  return (
    <Card className="w-full max-w-6xl mx-auto">
      <PostsWidgetHeader />

      <PostsWidgetContent />

      <PostAddDialog
        showAddDialog={showAddDialog}
        setShowAddDialog={setShowAddDialog}
        newPost={newPost}
        setNewPost={setNewPost}
        addPost={handleAddPost}
      />

      <PostEditDialog
        showEditDialog={showEditDialog}
        setShowEditDialog={setShowEditDialog}
        selectedPost={selectedPost}
        setSelectedPost={setSelectedPost}
        updatePost={handleUpdatePost}
      />

      <CommentDialogs />

      <PostDetailWithComments
        selectedPost={selectedPost}
        comments={selectedPost?.id ? { [selectedPost.id]: [] } : {}}
        searchQuery=""
        highlightText={highlightText}
      />

      <UserModal />
    </Card>
  )
}
