import api from "@/config/api"

export interface ClientRequest {
  id?: number
  name: string
  email: string
}

export interface ClientResponse {
  id: number
  name: string
  email: string
}

const getClients = async (limit: number): Promise<ClientResponse[]> => {
  const { data } = await api.get("/clients", {
    params: {
      limit,
    },
  })
  return data
}

const createClient = async (client: ClientRequest) => {
  const { data } = await api.post("/clients/create", client)
  return data
}

const updateClient = async (client: ClientRequest) => {
  const { data } = await api.put(`/clients/update/${client.id}`, client)
  return data
}

const deleteClient = async (id: number) => {
  const { data } = await api.delete(`/clients/delete/${id}`)
  return data
}

export default {
  getClients,
  createClient,
  updateClient,
  deleteClient,
}
