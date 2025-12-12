import { useAtom } from "jotai"
import { selectedCommentAtom, newCommentAtom, selectedUserAtom } from "../../../shared/store/postAtoms"
import { useToggle } from "../../../shared/hooks/useToggle"
import useComments from "../../../features/post-comments/model/useComments"
import type { Comment, NewComment } from "../../../entities/comment/types"

export const useCommentsManager = (postId: number | null) => {
  const {
    comments,
    addComment: addCommentHook,
    updateComment: updateCommentHook,
    deleteComment: deleteCommentHook,
  } = useComments(postId)

  const [selectedComment, setSelectedComment] = useAtom(selectedCommentAtom)
  const [newComment, setNewComment] = useAtom(newCommentAtom)
  const [showAddCommentDialog, setShowAddCommentDialog] = useToggle(false)
  const [showEditCommentDialog, setShowEditCommentDialog] = useToggle(false)
  const [showPostDetailDialog, setShowPostDetailDialog] = useToggle(false)
  const [showUserModal, setShowUserModal] = useToggle(false)
  const [selectedUser] = useAtom(selectedUserAtom)

  const addComment = async () => {
    try {
      await addCommentHook(newComment)
      setShowAddCommentDialog(false)
      setNewComment({ body: "", postId: 0, userId: 1 })
    } catch (error) {
      console.error("댓글 추가 오류:", error)
    }
  }

  const updateComment = async () => {
    if (!selectedComment) return
    try {
      await updateCommentHook(selectedComment)
      setShowEditCommentDialog(false)
    } catch (error) {
      console.error("댓글 업데이트 오류:", error)
    }
  }

  const deleteComment = async (id: number) => {
    try {
      await deleteCommentHook({ id })
    } catch (error) {
      console.error("댓글 삭제 오류:", error)
    }
  }

  const setNewCommentForWidget = (c: Partial<Comment>) =>
    setNewComment((prev: NewComment) => ({ ...prev, ...(c as Partial<NewComment>) }))

  return {
    // Data
    comments,
    selectedComment,
    newComment,
    selectedUser,

    // UI State
    showAddCommentDialog,
    showEditCommentDialog,
    showPostDetailDialog,
    showUserModal,

    // Setters
    setSelectedComment,
    setNewComment,
    setShowAddCommentDialog,
    setShowEditCommentDialog,
    setShowPostDetailDialog,
    setShowUserModal,

    // Actions
    addComment,
    updateComment,
    deleteComment,
    setNewCommentForWidget,
  }
}
