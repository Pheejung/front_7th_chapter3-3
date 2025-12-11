import { useState } from "react"

/**
 * Pagination state hook used by widgets/features to manage skip/limit pagination.
 *
 * Purpose: shared/ui hook for local pagination state (skip/limit) used by lists and controls.
 * Inputs: initialSkip (default 0), initialLimit (default 10).
 * Returns: { skip, limit, setSkip, setLimit, setPage }
 * - setPage(pageIndex) sets skip = pageIndex * limit
 */
export function usePagination(initialSkip = 0, initialLimit = 10) {
  const [skip, setSkip] = useState<number>(initialSkip)
  const [limit, setLimit] = useState<number>(initialLimit)

  const setPage = (pageIndex: number) => setSkip(pageIndex * limit)

  return { skip, limit, setSkip, setLimit, setPage }
}

export default usePagination
