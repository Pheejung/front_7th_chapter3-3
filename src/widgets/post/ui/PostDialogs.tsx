import { ChangeEvent } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, Textarea, Input, Button } from "@/shared/ui"
import type { Post, NewPost } from "../../../entities/post/types"
import type { Comment, NewComment } from "../../../entities/comment/types"

interface Props {
  // post dialogs
  showAddDialog: boolean
  setShowAddDialog: (v: boolean) => void
  showEditDialog: boolean
  setShowEditDialog: (v: boolean) => void
  newPost: NewPost
  setNewPost: (p: NewPost) => void
  addPost: () => Promise<void>
  selectedPost: Post | null
  setSelectedPost: (p: Post | null) => void
  updatePost: () => Promise<void>

  // comment dialogs
  showAddCommentDialog: boolean
  setShowAddCommentDialog: (v: boolean) => void
  showEditCommentDialog: boolean
  setShowEditCommentDialog: (v: boolean) => void
  newComment: NewComment
  setNewComment: (c: NewComment) => void
  addComment: () => Promise<void>
  selectedComment: Comment | null
  setSelectedComment: (c: Comment | null) => void
  updateComment: () => Promise<void>
}

export default function PostDialogs({
  showAddDialog,
  setShowAddDialog,
  showEditDialog,
  setShowEditDialog,
  newPost,
  setNewPost,
  addPost,
  selectedPost,
  setSelectedPost,
  updatePost,
  showAddCommentDialog,
  setShowAddCommentDialog,
  showEditCommentDialog,
  setShowEditCommentDialog,
  newComment,
  setNewComment,
  addComment,
  selectedComment,
  setSelectedComment,
  updateComment,
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
              onChange={(e: ChangeEvent<HTMLInputElement>) => setNewPost({ ...newPost, title: e.target.value })}
            />
            <Textarea
              placeholder="내용"
              value={newPost.body}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNewPost({ ...newPost, body: e.target.value })}
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
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setSelectedPost(selectedPost ? { ...selectedPost, title: e.target.value } : selectedPost)
              }
            />
            <Textarea
              placeholder="내용"
              value={selectedPost?.body || ""}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setSelectedPost(selectedPost ? { ...selectedPost, body: e.target.value } : selectedPost)
              }
            />
            <Button onClick={() => void updatePost()}>게시물 업데이트</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddCommentDialog} onOpenChange={setShowAddCommentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>새 댓글 추가</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="댓글 내용"
              value={newComment.body}
              onChange={(e) => setNewComment({ ...newComment, body: e.target.value })}
            />
            <Button onClick={() => void addComment()}>댓글 추가</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditCommentDialog} onOpenChange={setShowEditCommentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>댓글 수정</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="댓글 내용"
              value={selectedComment?.body || ""}
              onChange={(e) =>
                setSelectedComment(selectedComment ? { ...selectedComment, body: e.target.value } : selectedComment)
              }
            />
            <Button onClick={() => void updateComment()}>댓글 업데이트</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
