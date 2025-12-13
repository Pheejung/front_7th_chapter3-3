import React from "react"
import type { Post } from "../../../entities/post/types"

interface Props {
  selectedPost: Post | null
  searchQuery: string
  highlightText: (text: string | undefined, highlight: string) => React.ReactNode
}

export default function PostDetail({ selectedPost, searchQuery, highlightText }: Props) {
  return (
    <div className="space-y-4">
      <p>{highlightText(selectedPost?.body, searchQuery)}</p>
    </div>
  )
}
