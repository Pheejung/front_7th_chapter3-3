import { useCallback } from "react"
import { useLocation, useNavigate } from "react-router-dom"

export const useUrlManager = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const updateURL = useCallback(
    (params: {
      skip?: number
      limit?: number
      searchQuery?: string
      sortBy?: string
      sortOrder?: string
      selectedTag?: string
    }) => {
      const urlParams = new URLSearchParams()
      if (params.skip) urlParams.set("skip", params.skip.toString())
      if (params.limit) urlParams.set("limit", params.limit.toString())
      if (params.searchQuery) urlParams.set("search", params.searchQuery)
      if (params.sortBy) urlParams.set("sortBy", params.sortBy)
      if (params.sortOrder) urlParams.set("sortOrder", params.sortOrder)
      if (params.selectedTag) urlParams.set("tag", params.selectedTag)
      navigate(`?${urlParams.toString()}`)
    },
    [navigate],
  )

  const parseURLParams = useCallback(() => {
    const params = new URLSearchParams(location.search)
    return {
      skip: parseInt(params.get("skip") || "0"),
      limit: parseInt(params.get("limit") || "10"),
      searchQuery: params.get("search") || "",
      sortBy: params.get("sortBy") || "",
      sortOrder: params.get("sortOrder") || "asc",
      selectedTag: params.get("tag") || "all",
    }
  }, [location.search])

  return {
    updateURL,
    parseURLParams,
  }
}
