import React from "react"
import { useAtom } from "jotai"
import { Dialog, DialogContent, DialogHeader, DialogTitle, Textarea, Button } from "@/shared/ui"
import {
  showAddCommentDialogAtom,
  showEditCommentDialogAtom,
  newCommentAtom,
  selectedCommentAtom,
} from "../../../shared/store/postAtoms"
import type { Comment } from "../../../entities/comment/types"

export default function CommentDialogs() {
  const [showAddCommentDialog, setShowAddCommentDialog] = useAtom(showAddCommentDialogAtom)
  const [showEditCommentDialog, setShowEditCommentDialog] = useAtom(showEditCommentDialogAtom)
  const [newComment, setNewComment] = useAtom(newCommentAtom)
  const [selectedComment, setSelectedComment] = useAtom(selectedCommentAtom)

  const handleAddComment = async () => {
    // TODO: Implement comment features
    setShowAddCommentDialog(false)
    setNewComment({ body: "", postId: 0, userId: 1 })
  }

  const handleUpdateComment = async () => {
    // TODO: Implement comment features
    setShowEditCommentDialog(false)
  }
  return (
    <>
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
            <Button onClick={handleAddComment}>댓글 추가</Button>
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
            <Button onClick={handleUpdateComment}>댓글 업데이트</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
