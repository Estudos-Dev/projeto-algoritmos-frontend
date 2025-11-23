import api from "@/config/api"
import type { ProductRequest } from "./products-service"

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
  items: ProductRequest[]
  total: number
}

const getSalles = async (limit: number): Promise<SaleResponse[]> => {
  const { data } = await api.get("/sales", {
    params: {
      limit,
    },
  })
  return data
}

const createSale = async (sale: SaleRequest) => {
  const { data } = await api.post("/sales/create", sale)
  return data
}

const updateSale = async (id: number, sale: SaleRequest) => {
  const { data } = await api.put(`/sales/${id}`, sale)
  return data
}

const deleteSale = async (id: number) => {
  const { data } = await api.delete(`/sales/${id}`)
  return data
}

export default {
  getSalles,
  createSale,
  updateSale,
  deleteSale,
}
