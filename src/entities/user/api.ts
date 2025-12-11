import type { UsersResponse } from "./types"
import { apiClient } from "../../shared/lib/fetch"

export async function fetchUsers(): Promise<UsersResponse> {
  return apiClient("/api/users?limit=0&select=username,image")
}
