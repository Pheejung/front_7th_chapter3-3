import { Search } from "lucide-react"
import { Input, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../../shared/ui"
import type { Tag } from "../../../entities/tag/types"

interface Props {
  searchQuery: string
  setSearchQuery: (v: string) => void
  tags: Tag[]
  selectedTag: string
  setSelectedTag: (v: string) => void
  sortBy: string
  setSortBy: (v: string) => void
  sortOrder: string
  setSortOrder: (v: string) => void
}

export default function PostsControls({
  searchQuery,
  setSearchQuery,
  tags,
  selectedTag,
  setSelectedTag,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
}: Props) {
  return (
    <div className="flex flex-col gap-4 mb-6">
      {/* 검색 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="게시물 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* 필터 및 정렬 컨트롤 */}
      <div className="flex gap-4">
        <Select value={selectedTag} onValueChange={setSelectedTag}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="태그 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">모든 태그</SelectItem>
            {tags.map((tag) => (
              <SelectItem key={tag.slug} value={tag.slug}>
                {tag.slug}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="id">ID</SelectItem>
            <SelectItem value="title">제목</SelectItem>
            <SelectItem value="createdAt">생성일</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortOrder} onValueChange={setSortOrder}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">오름차순</SelectItem>
            <SelectItem value="desc">내림차순</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
