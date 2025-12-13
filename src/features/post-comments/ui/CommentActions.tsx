import { Edit2, Trash2 } from "lucide-react"
import type { Comment } from "../../../entities/comment/types"
import { Button } from "../../../shared/ui"

interface Props {
  comment: Comment
  setSelectedComment: (c: Comment | null) => void
  setShowEditCommentDialog: (v: boolean) => void
  deleteComment: (id: number) => Promise<void>
}

export default function CommentActions({
  comment,
  setSelectedComment,
  setShowEditCommentDialog,
  deleteComment,
}: Props) {
  return (
    <div className="flex items-center space-x-1">
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
      <Button variant="ghost" size="sm" onClick={() => void deleteComment(comment.id)}>
        <Trash2 className="w-3 h-3" />
      </Button>
    </div>
  )
}
