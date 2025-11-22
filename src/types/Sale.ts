import type { Product } from "./Product"

export interface SaleRequest {
  id?: number
  total: number
  date: string
  products: Array<{
    productId: number
    quantity: number
    price: number
  }>
}

export interface SaleResponse {
  id: number
  sellerId: number
  sellerName: string
  clientId: number
  clientName: string
  date: string
  items: Product[]
  total: number
}
