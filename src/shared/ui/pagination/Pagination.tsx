import { Button } from "../../../shared/ui"

interface Props {
  skip: number
  limit: number
  total: number
  setSkip: (v: number) => void
  setLimit: (v: number) => void
  updateURL: (params: {
    skip?: number
    limit?: number
    searchQuery?: string
    sortBy?: string
    sortOrder?: string
    selectedTag?: string
  }) => void
}

export default function Pagination({ skip, limit, total, setSkip, setLimit, updateURL }: Props) {
  const currentPage = Math.floor(skip / limit) + 1
  const totalPages = Math.ceil(total / limit)

  const handlePageChange = (page: number) => {
    const newSkip = (page - 1) * limit
    setSkip(newSkip)
    updateURL({ skip: newSkip, limit })
  }

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit)
    setSkip(0) // 첫 페이지로 리셋
    updateURL({ skip: 0, limit: newLimit })
  }

  return (
    <div className="flex items-center justify-between mt-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">페이지당 항목:</span>
        <select
          value={limit}
          onChange={(e) => handleLimitChange(Number(e.target.value))}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          이전
        </Button>

        <span className="text-sm">
          {currentPage} / {totalPages}
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          다음
        </Button>
      </div>
    </div>
  )
}
