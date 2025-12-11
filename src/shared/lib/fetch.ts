export async function apiClient(input: RequestInfo | URL, init?: RequestInit) {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(init?.headers as Record<string, string> | undefined),
    }
    if (token) headers["Authorization"] = `Bearer ${token}`

    const res = await fetch(input, { ...init, headers })

    if (!res.ok) {
      const text = await res.text()
      const message = text || res.statusText
      // emit a global event so UI can show a toast if desired
      try {
        if (typeof window !== "undefined" && window.dispatchEvent) {
          window.dispatchEvent(new CustomEvent("api:error", { detail: { message, status: res.status } }))
        }
      } catch (e) {
        // ignore dispatch errors
      }
      throw new Error(message)
    }

    const contentType = res.headers.get("content-type") || ""
    if (contentType.includes("application/json")) {
      return res.json()
    }
    return undefined
  } catch (err) {
    // ensure consumers get Error instances
    if (err instanceof Error) throw err
    throw new Error(String(err))
  }
}

export default apiClient
