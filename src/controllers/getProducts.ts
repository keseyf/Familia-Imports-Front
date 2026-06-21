// controllers/getProducts.ts
import axios from "axios"
import type { Product } from "../utils/interfaces"

export async function fetchProductsByCategory(category: string, page = 1): Promise<{
  products: Product[]
  hasMore: boolean
}> {
  const response = await axios.get(`${import.meta.env.VITE_API_URL}products`, {
    params: { category, page, limit: 8 }
  })
  return response.data
}

export async function fetchCategoryCounts(): Promise<{ category: string; total: number }[]> {
  const response = await axios.get(`${import.meta.env.VITE_API_URL}products/counts`)
  return response.data.counts
}