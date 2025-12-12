import React from "react"
import { Edit2, MessageSquare, Search, ThumbsDown, ThumbsUp, Trash2 } from "lucide-react"
import {
  Button,
  Input,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../../../shared/ui"
import type { Post } from "../../../entities/post/types"
import type { Tag } from "../../../entities/tag/types"
import { highlightText } from "../../../shared/lib/highlight"

interface Props {
  posts: Post[]
  loading: boolean
  searchQuery: string
  setSearchQuery: (v: string) => void
  tags: Tag[]
  selectedTag: string
  setSelectedTag: (v: string) => void
  sortBy: string
  setSortBy: (v: string) => void
  sortOrder: string
  setSortOrder: (v: string) => void
  limit: number
  setLimit: (v: number) => void
  skip: number
  setSkip: (v: number) => void
  total: number
  openPostDetail: (post: Post) => void
  setSelectedPost: (post: Post | null) => void
  setShowEditDialog: (v: boolean) => void
  deletePost: (id: number) => Promise<void>
  updateURL: () => void
}

export default function PostsList({
  posts,
  loading,
  searchQuery,
  setSearchQuery,
  tags,
  selectedTag,
  setSelectedTag,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  limit,
  setLimit,
  skip,
  setSkip,
  total,
  openPostDetail,
  setSelectedPost,
  setShowEditDialog,
  deletePost,
  updateURL,
}: Props) {
  // use shared highlightText

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="게시물 검색..."
              className="pl-8"
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <Select
          value={selectedTag}
          onValueChange={(value: string) => {
            setSelectedTag(value)
            updateURL()
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="태그 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">모든 태그</SelectItem>
            {tags.map((tag: Tag) => (
              <SelectItem key={tag.url} value={tag.slug}>
                {tag.slug}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={(v: string) => setSortBy(v)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="정렬 기준" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">없음</SelectItem>
            <SelectItem value="id">ID</SelectItem>
            <SelectItem value="title">제목</SelectItem>
            <SelectItem value="reactions">반응</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortOrder} onValueChange={(v: string) => setSortOrder(v)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="정렬 순서" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">오름차순</SelectItem>
            <SelectItem value="desc">내림차순</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center p-4">로딩 중...</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">ID</TableHead>
              <TableHead>제목</TableHead>
              <TableHead className="w-[150px]">작성자</TableHead>
              <TableHead className="w-[150px]">반응</TableHead>
              <TableHead className="w-[150px]">작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell>{post.id}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div>{highlightText(post.title, searchQuery)}</div>
                    <div className="flex flex-wrap gap-1">
                      {post.tags?.map((tag) => (
                        <span
                          key={tag}
                          className={`px-1 text-[9px] font-semibold rounded-[4px] cursor-pointer ${
                            selectedTag === tag
                              ? "text-white bg-blue-500 hover:bg-blue-600"
                              : "text-blue-800 bg-blue-100 hover:bg-blue-200"
                          }`}
                          onClick={() => {
                            setSelectedTag(tag)
                            updateURL()
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2 cursor-pointer" onClick={() => openPostDetail(post)}>
                    <img src={post.author?.image} alt={post.author?.username} className="w-8 h-8 rounded-full" />
                    <span>{post.author?.username}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <ThumbsUp className="w-4 h-4" />
                    <span>{post.reactions?.likes || 0}</span>
                    <ThumbsDown className="w-4 h-4" />
                    <span>{post.reactions?.dislikes || 0}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => openPostDetail(post)}>
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedPost(post)
                        setShowEditDialog(true)
                      }}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => void deletePost(post.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span>표시</span>
          <Select value={limit.toString()} onValueChange={(value: string) => setLimit(Number(value))}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="30">30</SelectItem>
            </SelectContent>
          </Select>
          <span>항목</span>
        </div>
        <div className="flex gap-2">
          <Button disabled={skip === 0} onClick={() => setSkip(Math.max(0, skip - limit))}>
            이전
          </Button>
          <Button disabled={skip + limit >= total} onClick={() => setSkip(skip + limit)}>
            다음
          </Button>
        </div>
      </div>
    </div>
  )
}
