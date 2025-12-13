import { Plus } from "lucide-react"
import { useAtom } from "jotai"
import { Button } from "../../../shared/ui"
import { showAddCommentDialogAtom, newCommentAtom } from "../../../shared/store/postAtoms"

interface Props {
  postId: number
}

export default function CommentHeader({ postId }: Props) {
  const [, setShowAddCommentDialog] = useAtom(showAddCommentDialogAtom)
  const [, setNewComment] = useAtom(newCommentAtom)
  return (
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-sm font-semibold">댓글</h3>
      <Button
        size="sm"
        onClick={() => {
          setNewComment({ body: "", postId, userId: 1 })
          setShowAddCommentDialog(true)
        }}
      >
        <Plus className="w-3 h-3 mr-1" />
        댓글 추가
      </Button>
    </div>
  )
}
