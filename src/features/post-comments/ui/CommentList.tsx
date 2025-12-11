import React from "react"
import { Edit2, Plus, ThumbsUp, Trash2 } from "lucide-react"
import type { Comment } from "../../../entities/comment/types"
import { Button } from "../../../components"

interface Props {
  postId?: number | null
  comments: Record<number, Comment[]>
  setNewComment: (c: Partial<Comment>) => void
  setShowAddCommentDialog: (v: boolean) => void
  likeComment: (id: number, postId: number) => Promise<void>
  setSelectedComment: (c: Comment | null) => void
  setShowEditCommentDialog: (v: boolean) => void
  deleteComment: (id: number, postId: number) => Promise<void>
  searchQuery: string
  highlightText: (text: string | undefined, highlight: string) => React.ReactNode
}

export default function CommentsList({
  postId,
  comments,
  setNewComment,
  setShowAddCommentDialog,
  likeComment,
  setSelectedComment,
  setShowEditCommentDialog,
  deleteComment,
  searchQuery,
  highlightText,
}: Props) {
  if (postId == null) return null
  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">댓글</h3>
        <Button
          size="sm"
          onClick={() => {
            setNewComment({ postId })
            setShowAddCommentDialog(true)
          }}
        >
          <Plus className="w-3 h-3 mr-1" />
          댓글 추가
        </Button>
      </div>
      <div className="space-y-1">
        {comments[postId]?.map((comment) => (
          <div key={comment.id} className="flex items-center justify-between text-sm border-b pb-1">
            <div className="flex items-center space-x-2 overflow-hidden">
              <span className="font-medium truncate">{comment.user.username}:</span>
              <span className="truncate">{highlightText(comment.body, searchQuery)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="sm" onClick={() => void likeComment(comment.id, postId)}>
                <ThumbsUp className="w-3 h-3" />
                <span className="ml-1 text-xs">{comment.likes}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedComment(comment)
                  setShowEditCommentDialog(true)
                }}
              >
                <Edit2 className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => void deleteComment(comment.id, postId)}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
