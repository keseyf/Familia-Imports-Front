import { useEffect, useState } from "react"
import { BiPackage } from "react-icons/bi"
import { FaWhatsapp } from "react-icons/fa"
import { TbTrash } from "react-icons/tb"
import HeaderAdmin from "../../components/common/HeaderA"
import { getOrders, updateOrderStatus, deleteOrder } from "../../controllers/ordersController"

type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled"

interface Product {
  id: string
  name: string
  imageUrls: string[]
  category: string
  price: number
}

interface Order {
  id: string
  product: Product
  quantity: number
  totalPrice: number
  userPhone: string
  userName: string
  status: OrderStatus
  createdAt: string
}

const statusConfig: Record<OrderStatus, { label: string; color: string }> = {
  pending:   { label: "Pendente",  color: "bg-amber-100 text-amber-700 border-amber-200" },
  paid:      { label: "Pago",      color: "bg-green-100 text-green-700 border-green-200" },
  shipped:   { label: "Enviado",   color: "bg-blue-100 text-blue-700 border-blue-200" },
  delivered: { label: "Entregue",  color: "bg-gray-100 text-gray-600 border-gray-200" },
  cancelled: { label: "Cancelado", color: "bg-red-100 text-red-600 border-red-200" },
}

const filters = [
  { key: "all",       label: "Todos" },
  { key: "pending",   label: "Pendente" },
  { key: "paid",      label: "Pago" },
  { key: "shipped",   label: "Enviado" },
  { key: "delivered", label: "Entregue" },
  { key: "cancelled", label: "Cancelado" },
]

function OrderCard({
  order,
  onStatusChange,
  onDelete,
  updating,
}: {
  order: Order
  onStatusChange: (id: string, status: OrderStatus) => void
  onDelete: (id: string) => void
  updating: boolean
}) {
  const cfg = statusConfig[order.status]
  const date = new Date(order.createdAt).toLocaleString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  })

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center hover:shadow-md transition-all duration-200">

      <img
        src={order.product.imageUrls?.[0] ?? "/placeholder.png"}
        alt={order.product.name}
        className="w-16 h-16 object-cover rounded-xl border border-gray-100 shrink-0"
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono text-gray-400">
            #{order.id.slice(0, 8).toUpperCase()}
          </span>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${cfg.color}`}>
            {cfg.label}
          </span>
        </div>
        <h3 className="font-semibold text-gray-800 text-sm mt-1">
          {order.product.name}{" "}
          <span className="text-gray-400 font-normal">({order.quantity}x)</span>
        </h3>
        <p className="text-xs text-gray-400 mt-0.5 flex flex-wrap gap-3">
          <span>👤 {order.userName}</span>
          <span>📱 {order.userPhone}</span>
          <span>🕐 {date}</span>
        </p>
      </div>

      <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 sm:gap-2 shrink-0 w-full sm:w-auto">
        <span className="font-black text-gray-900 text-base">
          R$ {order.totalPrice.toFixed(2)}
        </span>

        <div className="flex items-center gap-2">
          <select
            value={order.status}
            onChange={e => onStatusChange(order.id, e.target.value as OrderStatus)}
            disabled={updating}
            className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-gray-700 focus:outline-none focus:border-gray-400 disabled:opacity-50 cursor-pointer"
          >
            <option value="pending">Pendente</option>
            <option value="paid">Pago</option>
            <option value="shipped">Enviado</option>
            <option value="delivered">Entregue</option>
            <option value="cancelled">Cancelado</option>
          </select>

          <a
            href={`https://wa.me/55${order.userPhone.replace(/\D/g, "")}`}
            target="_blank"
            rel="noreferrer"
            title="Falar com cliente"
            className="p-2 rounded-xl bg-green-50 hover:bg-green-100 text-green-600 transition-all"
          >
            <FaWhatsapp className="text-base" />
          </a>

          <button
            onClick={() => onDelete(order.id)}
            title="Deletar pedido"
            className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 transition-all"
          >
            <TbTrash className="text-base" />
          </button>
        </div>

        {updating && (
          <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
        )}
      </div>
    </div>
  )
}

export default function AdminPedidos() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const [error, setError] = useState("")
  const [filter, setFilter] = useState("all")
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("adminToken")
    if (!token) { window.location.href = "/admin"; return }
    setAuthorized(true)
    fetchOrders()
  }, [])

  async function fetchOrders() {
    try {
      setLoading(true)
      const data = await getOrders()
      setOrders(data.orders)
    } catch (err: any) {
      if (err.message === "401") { window.location.href = "/admin"; return }
      setError(err.message ?? "Erro ao buscar pedidos")
    } finally {
      setLoading(false)
    }
  }

  async function handleStatusChange(id: string, status: OrderStatus) {
    setUpdatingId(id)
    try {
      await updateOrderStatus({ id, status })
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
    } catch (err: any) {
      alert(err.message ?? "Erro ao atualizar status")
    } finally {
      setUpdatingId(null)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja deletar este pedido?")) return
    try {
      await deleteOrder(id)
      setOrders(prev => prev.filter(o => o.id !== id))
    } catch (err: any) {
      alert(err.message ?? "Erro ao deletar pedido")
    }
  }

  if (!authorized) return null

  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter)
  const pendingCount = orders.filter(o => o.status === "pending").length

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderAdmin />
      <main className="max-w-6xl mx-auto px-4 py-10">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Pedidos</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {orders.length} pedido{orders.length !== 1 ? "s" : ""} no total
            </p>
          </div>
          {pendingCount > 0 && (
            <span className="bg-amber-100 text-amber-700 text-sm font-semibold px-4 py-2 rounded-full border border-amber-200">
              {pendingCount} aguardando
            </span>
          )}
        </div>

        <div className="flex gap-2 flex-wrap mb-6">
          {filters.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                filter === f.key
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-500 border border-gray-200 hover:border-gray-400"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-20">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-3">
            <BiPackage className="text-5xl text-gray-200" />
            <p className="text-gray-400 text-sm">Nenhum pedido encontrado</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map(order => (
              <OrderCard
                key={order.id}
                order={order}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
                updating={updatingId === order.id}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}