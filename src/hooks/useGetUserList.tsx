import api from "@/config/api"
import { useState } from "react"

export const useGetUserList = () => {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const getUsers = async () => {
    try {
      setIsLoading(true)
      const { data } = await api.get("/users")
      setUsers(data)
      setIsLoading(false)
    } catch (error) {
      console.log("Erro ao buscar os usuários", error)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    users,
    isLoading,
    getUsers,
  }
}
