import api from "@/config/api"

export interface ProductRequest {
  id?: number
  name: string
  price: number
}

export interface ProductResponse {
  id: number
  name: string
  price: number
}

const getProducts = async (limit: number): Promise<ProductResponse[]> => {
  const { data } = await api.get("/products", {
    params: {
      limit,
    },
  })
  return data
}

const createProduct = async (client: ProductRequest) => {
  const { data } = await api.post("/products/create", client)
  return data
}

const updateProduct = async (client: ProductRequest) => {
  const { data } = await api.put(`/products/update/${client.id}`, client)
  return data
}

const deleteProduct = async (id: number) => {
  const { data } = await api.delete(`/products/delete/${id}`)
  return data
}

export default {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
}
