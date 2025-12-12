export const queryKeys = {
  posts: ["posts"] as const,
  post: (id: number) => ["posts", id] as const,
  postsByTag: (tag: string) => ["posts", "tag", tag] as const,
  searchPosts: (query: string) => ["posts", "search", query] as const,
  comments: (postId: number) => ["comments", postId] as const,
  tags: ["tags"] as const,
  users: ["users"] as const,
}
