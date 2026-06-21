import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:4444",
  headers: { "Content-Type": "application/json" },
})

// Injeta o token automaticamente em todas as chamadas
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken")
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

interface OrderItem {
  productId: string
  quantity: number
  totalPrice: number
}

interface CreateOrderPayload {
  items: OrderItem[]
  userName: string
  userPhone: string
}

interface UpdateOrderStatusPayload {
  id: string
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled"
}

export async function createOrder(payload: CreateOrderPayload) {
  try {
    const { data } = await api.post("/orders", payload)
    return data
  } catch (err: any) {
    throw new Error(err.response?.data?.message ?? "Erro ao criar pedido")
  }
}

// controllers/ordersController.ts — adiciona essa função

export async function deleteOrder(id: string) {
  try {
    const { data } = await api.delete(`/orders/delete/${id}`)
    return data
  } catch (err: any) {
    throw new Error(err.response?.data?.message ?? "Erro ao deletar pedido")
  }
}

export async function getOrders() {
  try {
    const { data } = await api.get("/orders")
    return data
  } catch (err: any) {
    if (err.response?.status === 401) throw new Error("401")
    throw new Error(err.response?.data?.message ?? "Erro ao buscar pedidos")
  }
}

export async function updateOrderStatus({ id, status }: UpdateOrderStatusPayload) {
  try {
    const { data } = await api.patch(`/orders/${id}/status`, { status })
    return data
  } catch (err: any) {
    throw new Error(err.response?.data?.message ?? "Erro ao atualizar status")
  }
}