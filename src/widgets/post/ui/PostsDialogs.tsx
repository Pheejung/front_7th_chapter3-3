import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea, Button } from "@/shared/ui"
import PostDetail from "../../../features/post-detail/ui/PostDetail"
import UserModal from "../../../features/user/ui/UserModal"
import highlightText from "@/shared/lib/highlight"
import type { Post } from "@/entities/post/types"
import type { Comment, NewComment } from "@/entities/comment/types"
import type { User } from "@/entities/user/types"

interface PostsDialogsProps {
  // Post related
  selectedPost: Post | null
  showEditDialog: boolean
  setShowEditDialog: (v: boolean) => void
  updatePost: () => Promise<void>
  setSelectedPost: React.Dispatch<React.SetStateAction<Post | null>>

  // Comment related
  showAddCommentDialog: boolean
  setShowAddCommentDialog: (v: boolean) => void
  showEditCommentDialog: boolean
  setShowEditCommentDialog: (v: boolean) => void
  showPostDetailDialog: boolean
  setShowPostDetailDialog: (v: boolean) => void
  comments: Record<number, Comment[]>
  newComment: NewComment
  setNewComment: React.Dispatch<React.SetStateAction<NewComment>>
  selectedComment: Comment | null
  setSelectedComment: React.Dispatch<React.SetStateAction<Comment | null>>
  addComment: () => Promise<void>
  updateComment: () => Promise<void>
  deleteComment: (id: number) => Promise<void>
  setNewCommentForWidget: (c: Partial<Comment>) => void
  searchQuery: string

  // User modal
  showUserModal: boolean
  setShowUserModal: (v: boolean) => void
  selectedUser: User | null
}

export default function PostsDialogs({
  selectedPost,
  showEditDialog,
  setShowEditDialog,
  updatePost,
  setSelectedPost,
  showAddCommentDialog,
  setShowAddCommentDialog,
  showEditCommentDialog,
  setShowEditCommentDialog,
  showPostDetailDialog,
  setShowPostDetailDialog,
  comments,
  newComment,
  setNewComment,
  selectedComment,
  setSelectedComment,
  addComment,
  updateComment,
  deleteComment,
  setNewCommentForWidget,
  searchQuery,
  showUserModal,
  setShowUserModal,
  selectedUser,
}: PostsDialogsProps) {
  return (
    <>
      {/* Post Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>게시물 수정</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="제목"
              value={selectedPost?.title || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSelectedPost((prev) => (prev ? { ...prev, title: e.target.value } : prev))
              }
            />
            <Textarea
              rows={15}
              placeholder="내용"
              value={selectedPost?.body || ""}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setSelectedPost((prev) => (prev ? { ...prev, body: e.target.value } : prev))
              }
            />
            <Button onClick={updatePost}>게시물 업데이트</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Comment Dialog */}
      <Dialog open={showAddCommentDialog} onOpenChange={setShowAddCommentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>새 댓글 추가</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="댓글 내용"
              value={newComment.body}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setNewComment({ ...newComment, body: e.target.value })
              }
            />
            <Button onClick={addComment}>댓글 추가</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Comment Dialog */}
      <Dialog open={showEditCommentDialog} onOpenChange={setShowEditCommentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>댓글 수정</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="댓글 내용"
              value={selectedComment?.body || ""}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setSelectedComment((prev: Comment | null) => (prev ? { ...prev, body: e.target.value } : prev))
              }
            />
            <Button onClick={updateComment}>댓글 업데이트</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Post Detail Dialog */}
      <PostDetail
        selectedPost={selectedPost}
        showPostDetailDialog={showPostDetailDialog}
        setShowPostDetailDialog={setShowPostDetailDialog}
        comments={comments}
        setNewComment={setNewCommentForWidget}
        setShowAddCommentDialog={setShowAddCommentDialog}
        setSelectedComment={setSelectedComment}
        setShowEditCommentDialog={setShowEditCommentDialog}
        deleteComment={deleteComment}
        searchQuery={searchQuery}
        highlightText={highlightText}
      />

      {/* User Modal */}
      <UserModal selectedUser={selectedUser} showUserModal={showUserModal} setShowUserModal={setShowUserModal} />
    </>
  )
}
