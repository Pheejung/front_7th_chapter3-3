import React from "react"
import { useAtom } from "jotai"
import type { Comment } from "../../../entities/comment/types"
import CommentHeader from "../../../features/post-comments/ui/CommentHeader"
import CommentItem from "../../../features/post-comments/ui/CommentItem"
import CommentActions from "../../../features/post-comments/ui/CommentActions"
import { showEditCommentDialogAtom, selectedCommentAtom } from "../../../shared/store/postAtoms"

interface Props {
  postId?: number | null
  comments: Record<number, Comment[]>
  searchQuery: string
  highlightText: (text: string | undefined, highlight: string) => React.ReactNode
}

export default function CommentSection({ postId, comments, searchQuery, highlightText }: Props) {
  const [, setShowEditCommentDialog] = useAtom(showEditCommentDialogAtom)
  const [, setSelectedComment] = useAtom(selectedCommentAtom)

  const handleDeleteComment = async (id: number) => {
    // TODO: Implement comment features with id
    console.log("Delete comment:", id)
  }
  if (postId == null) return null
  return (
    <div className="mt-2">
      <CommentHeader postId={postId} />
      <div className="space-y-1">
        {comments[postId]?.map((comment) => (
          <div key={comment.id} className="flex items-center justify-between text-sm border-b pb-1">
            <CommentItem comment={comment} searchQuery={searchQuery} highlightText={highlightText} />
            <CommentActions
              comment={comment}
              setSelectedComment={setSelectedComment}
              setShowEditCommentDialog={setShowEditCommentDialog}
              deleteComment={handleDeleteComment}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
