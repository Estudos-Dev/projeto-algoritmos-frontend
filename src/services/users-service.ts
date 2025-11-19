import api from "@/config/api"

const getUserList = async () => {
  const { data } = await api.get("/users")
  return data
}
