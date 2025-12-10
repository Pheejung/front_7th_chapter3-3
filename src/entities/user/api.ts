import type { UsersResponse } from "./types"

export async function fetchUsers(): Promise<UsersResponse> {
  const res = await fetch("/api/users?limit=0&select=username,image")
  return res.json()
}
