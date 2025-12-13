import { CardContent, Pagination } from "@/shared/ui"
import PostsControls from "../../../features/post-list/ui/PostsControls"
import PostsTable from "../../../features/post-list/ui/PostsTable"
import { usePostsWidget } from "../model/usePostsWidget"

export default function PostsWidgetContent() {
  const {
    posts,
    loading,
    tags,
    total,
    searchQuery,
    setSearchQuery,
    selectedTag,
    setSelectedTag,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    skip,
    limit,
    setSkip,
    setLimit,
    openPostDetail,
    setSelectedPost,
    setShowEditDialog,
    deletePost,
    updateURL,
  } = usePostsWidget()

  return (
    <CardContent>
      <PostsControls
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        tags={tags}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />

      <PostsTable
        posts={posts}
        loading={loading}
        searchQuery={searchQuery}
        openPostDetail={openPostDetail}
        setSelectedPost={setSelectedPost}
        setShowEditDialog={setShowEditDialog}
        deletePost={deletePost}
      />

      <Pagination skip={skip} limit={limit} total={total} setSkip={setSkip} setLimit={setLimit} updateURL={updateURL} />
    </CardContent>
  )
}
