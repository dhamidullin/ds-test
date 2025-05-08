import { api } from "./api"

// the convention around swr is to use a fetcher function

export const fetcher = <T>(url: string): Promise<T> => {
  return api.get<T>(url).then(res => res.data)
}
