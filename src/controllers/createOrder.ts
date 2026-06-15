import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3333",
  headers: { "Content-Type": "application/json" },
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

export async function updateOrderStatus({ id, status }: UpdateOrderStatusPayload) {
  try {
    const { data } = await api.patch(`/orders/${id}/status`, { status })
    return data
  } catch (err: any) {
    throw new Error(err.response?.data?.message ?? "Erro ao atualizar status")
  }
}