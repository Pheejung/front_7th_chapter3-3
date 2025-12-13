import { Edit2, MessageSquare, Trash2 } from "lucide-react"
import { Button, Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../../shared/ui"
import type { Post } from "../../../entities/post/types"
import { highlightText } from "../../../shared/lib/highlight"

interface Props {
  posts: Post[]
  loading: boolean
  searchQuery: string
  openPostDetail: (post: Post) => void
  setSelectedPost: (post: Post | null) => void
  setShowEditDialog: (v: boolean) => void
  deletePost: (id: number) => Promise<void>
}

export default function PostsTable({
  posts,
  loading,
  searchQuery,
  openPostDetail,
  setSelectedPost,
  setShowEditDialog,
  deletePost,
}: Props) {
  if (loading) {
    return <div className="text-center py-8">로딩 중...</div>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>제목</TableHead>
          <TableHead>내용</TableHead>
          <TableHead>작업</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((post) => (
          <TableRow key={post.id}>
            <TableCell>{post.id}</TableCell>
            <TableCell>
              <div className="cursor-pointer hover:text-blue-600" onClick={() => openPostDetail(post)}>
                {highlightText(post.title, searchQuery)}
              </div>
            </TableCell>
            <TableCell>
              <div className="max-w-xs truncate">{highlightText(post.body, searchQuery)}</div>
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => openPostDetail(post)}>
                  <MessageSquare className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedPost(post)
                    setShowEditDialog(true)
                  }}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => deletePost(post.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
