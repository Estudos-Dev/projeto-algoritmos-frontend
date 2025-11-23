import api from "@/config/api"

export interface SellerRequest {
  id?: number
  name: string
  email: string
}

export interface SellerResponse {
  id: number
  name: string
  email: string
}

const getSellers = async (limit: number): Promise<SellerResponse[]> => {
  const { data } = await api.get("/sellers", {
    params: {
      limit,
    },
  })
  return data
}

const createSeller = async (client: SellerRequest) => {
  const { data } = await api.post("/sellers/create", client)
  return data
}

const updateSeller = async (client: SellerRequest) => {
  const { data } = await api.put(`/sellers/update/${client.id}`, client)
  return data
}

const deleteSeller = async (id: number) => {
  const { data } = await api.delete(`/sellers/delete/${id}`)
  return data
}

export default {
  getSellers,
  createSeller,
  updateSeller,
  deleteSeller,
}
