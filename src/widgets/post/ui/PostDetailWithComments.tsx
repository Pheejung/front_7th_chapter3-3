import React from "react"
import { useAtom } from "jotai"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../shared/ui"
import PostDetail from "../../../features/post-detail/ui/PostDetail"
import CommentSection from "./CommentSection"
import { showPostDetailDialogAtom } from "../../../shared/store/postAtoms"
import type { Post } from "../../../entities/post/types"
import type { Comment } from "../../../entities/comment/types"

interface Props {
  selectedPost: Post | null
  comments: Record<number, Comment[]>
  searchQuery: string
  highlightText: (text: string | undefined, highlight: string) => React.ReactNode
}

export default function PostDetailWithComments({ selectedPost, comments, searchQuery, highlightText }: Props) {
  const [showPostDetailDialog, setShowPostDetailDialog] = useAtom(showPostDetailDialogAtom)
  return (
    <Dialog open={showPostDetailDialog} onOpenChange={setShowPostDetailDialog}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{highlightText(selectedPost?.title, searchQuery)}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <PostDetail selectedPost={selectedPost} searchQuery={searchQuery} highlightText={highlightText} />
          <CommentSection
            postId={selectedPost?.id}
            comments={comments}
            searchQuery={searchQuery}
            highlightText={highlightText}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
