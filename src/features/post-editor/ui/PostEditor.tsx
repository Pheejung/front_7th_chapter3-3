import type { Dispatch, SetStateAction } from "react"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea } from "../../../shared/ui"
import type { NewPost, Post } from "../../../entities/post/types"

interface Props {
  // add
  showAddDialog: boolean
  setShowAddDialog: (v: boolean) => void
  newPost: NewPost
  setNewPost: (p: NewPost) => void
  addPost: () => Promise<void>
  // edit
  showEditDialog: boolean
  setShowEditDialog: (v: boolean) => void
  selectedPost: Post | null
  setSelectedPost: Dispatch<SetStateAction<Post | null>>
  updatePost: () => Promise<void>
}

export default function PostEditor({
  showAddDialog,
  setShowAddDialog,
  newPost,
  setNewPost,
  addPost,
  showEditDialog,
  setShowEditDialog,
  selectedPost,
  setSelectedPost,
  updatePost,
}: Props) {
  return (
    <>
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>새 게시물 추가</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="제목"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            />
            <Textarea
              rows={30}
              placeholder="내용"
              value={newPost.body}
              onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
            />
            <Input
              type="number"
              placeholder="사용자 ID"
              value={String(newPost.userId)}
              onChange={(e) => setNewPost({ ...newPost, userId: Number(e.target.value) })}
            />
            <Button onClick={() => void addPost()}>게시물 추가</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>게시물 수정</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="제목"
              value={selectedPost?.title || ""}
              onChange={(e) =>
                setSelectedPost((prev: Post | null) => (prev ? { ...prev, title: e.target.value } : prev))
              }
            />
            <Textarea
              rows={15}
              placeholder="내용"
              value={selectedPost?.body || ""}
              onChange={(e) =>
                setSelectedPost((prev: Post | null) => (prev ? { ...prev, body: e.target.value } : prev))
              }
            />
            <Button onClick={() => void updatePost()}>게시물 업데이트</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
