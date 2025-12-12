import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  fetchComments as apiFetchComments,
  addComment as apiAddComment,
  updateComment as apiUpdateComment,
  deleteComment as apiDeleteComment,
} from "../../../entities/comment/api"

export default function useComments(postId: number | null) {
  const queryClient = useQueryClient()

  const { data: comments = [], ...queryInfo } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => apiFetchComments(postId!),
    enabled: !!postId,
  })

  const addCommentMutation = useMutation({
    mutationFn: apiAddComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] })
    },
  })

  const updateCommentMutation = useMutation({
    mutationFn: apiUpdateComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] })
    },
  })

  const deleteCommentMutation = useMutation({
    mutationFn: ({ id }: { id: number }) => apiDeleteComment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] })
    },
  })

  return {
    comments: postId ? { [postId]: comments } : {},
    isLoading: queryInfo.isLoading,
    error: queryInfo.error,
    addComment: addCommentMutation.mutateAsync,
    updateComment: updateCommentMutation.mutateAsync,
    deleteComment: deleteCommentMutation.mutateAsync,
  }
}
