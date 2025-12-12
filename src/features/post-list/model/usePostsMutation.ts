import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  addPost as apiAddPost,
  updatePost as apiUpdatePost,
  deletePost as apiDeletePost,
} from "../../../entities/post/api"
import { queryKeys } from "../../../shared/lib/queryKeys"

export function usePostsMutation() {
  const queryClient = useQueryClient()

  // Mutations
  const addPostMutation = useMutation({
    mutationFn: apiAddPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts })
    },
  })

  const updatePostMutation = useMutation({
    mutationFn: apiUpdatePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts })
    },
  })

  const deletePostMutation = useMutation({
    mutationFn: apiDeletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts })
    },
  })

  return {
    addPost: addPostMutation.mutateAsync,
    updatePost: updatePostMutation.mutateAsync,
    deletePost: deletePostMutation.mutateAsync,
  }
}
