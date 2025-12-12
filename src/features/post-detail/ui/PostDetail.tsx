import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../shared/ui"
import type { Post } from "../../../entities/post/types"
import type { Comment } from "../../../entities/comment/types"
import CommentsList from "../../post-comments/ui/CommentList"

interface Props {
  selectedPost: Post | null
  showPostDetailDialog: boolean
  setShowPostDetailDialog: (v: boolean) => void
  comments: Record<number, Comment[]>
  setNewComment: (c: Partial<Comment>) => void
  setShowAddCommentDialog: (v: boolean) => void
  setSelectedComment: (c: Comment | null) => void
  setShowEditCommentDialog: (v: boolean) => void
  deleteComment: (id: number) => Promise<void>
  searchQuery: string
  highlightText: (text: string | undefined, highlight: string) => React.ReactNode
}

export default function PostDetail({
  selectedPost,
  showPostDetailDialog,
  setShowPostDetailDialog,
  comments,
  setNewComment,
  setShowAddCommentDialog,
  setSelectedComment,
  setShowEditCommentDialog,
  deleteComment,
  searchQuery,
  highlightText,
}: Props) {
  return (
    <Dialog open={showPostDetailDialog} onOpenChange={setShowPostDetailDialog}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{highlightText(selectedPost?.title, searchQuery)}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>{highlightText(selectedPost?.body, searchQuery)}</p>
          <CommentsList
            postId={selectedPost?.id}
            comments={comments}
            setNewComment={setNewComment}
            setShowAddCommentDialog={setShowAddCommentDialog}
            setSelectedComment={setSelectedComment}
            setShowEditCommentDialog={setShowEditCommentDialog}
            deleteComment={deleteComment}
            searchQuery={searchQuery}
            highlightText={highlightText}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
