import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea } from "../../../shared/ui"
import type { Post } from "../../../entities/post/types"

interface Props {
  showEditDialog: boolean
  setShowEditDialog: (v: boolean) => void
  selectedPost: Post | null
  setSelectedPost: React.Dispatch<React.SetStateAction<Post | null>>
  updatePost: () => Promise<void>
}

export default function PostEditDialog({
  showEditDialog,
  setShowEditDialog,
  selectedPost,
  setSelectedPost,
  updatePost,
}: Props) {
  return (
    <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>게시물 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="제목"
            value={selectedPost?.title || ""}
            onChange={(e) => setSelectedPost((prev: Post | null) => (prev ? { ...prev, title: e.target.value } : prev))}
          />
          <Textarea
            rows={15}
            placeholder="내용"
            value={selectedPost?.body || ""}
            onChange={(e) => setSelectedPost((prev: Post | null) => (prev ? { ...prev, body: e.target.value } : prev))}
          />
          <Button onClick={() => void updatePost()}>게시물 업데이트</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
