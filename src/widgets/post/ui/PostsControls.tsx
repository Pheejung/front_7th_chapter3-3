import { ChangeEvent } from "react"
import { Input, Button } from "@/shared/ui"

interface Props {
  searchQuery: string
  setSearchQuery: (v: string) => void
  sortBy: string
  setSortBy: (v: string) => void
  sortOrder: string
  setSortOrder: (v: string) => void
  selectedTag: string
  setSelectedTag: (v: string) => void
  skip: number
  limit: number
  setSkip: (v: number) => void
  setLimit: (v: number) => void
  total: number
}

export default function PostsControls({
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  selectedTag,
  setSelectedTag,
  skip,
  limit,
  setSkip,
  setLimit,
  total,
}: Props) {
  return (
    <div className="flex items-center justify-between mb-4 space-x-2">
      <div className="flex items-center space-x-2">
        <Input
          placeholder="검색어"
          value={searchQuery}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="flex items-center space-x-2">
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border rounded px-2 py-1">
          <option value="">정렬 없음</option>
          <option value="title">제목</option>
          <option value="likes">좋아요</option>
        </select>
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="border rounded px-2 py-1">
          <option value="asc">오름차순</option>
          <option value="desc">내림차순</option>
        </select>
        <select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="">모든 태그</option>
          <option value="all">all</option>
        </select>
        <div className="text-sm">
          {skip + 1}-{Math.min(skip + limit, total)} / {total}
        </div>
        <div className="flex items-center space-x-1">
          <Button onClick={() => setSkip(Math.max(0, skip - limit))} size="sm">
            이전
          </Button>
          <Button onClick={() => setSkip(skip + limit)} size="sm">
            다음
          </Button>
          <select
            value={limit}
            onChange={(e) => setLimit(parseInt(e.target.value))}
            className="border rounded px-2 py-1"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>
    </div>
  )
}
