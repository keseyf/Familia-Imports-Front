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
  groupId: string
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

function OrderCard({ order }: { order: Order }) {
  const date = new Date(order.createdAt).toLocaleString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  })

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4">
      <img
        src={order.product.imageUrls?.[0] ?? "/placeholder.png"}
        alt={order.product.name}
        className="w-14 h-14 object-cover rounded-xl border border-gray-100 shrink-0"
      />
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-800 text-sm truncate">
          {order.product.name}{" "}
          <span className="text-gray-400 font-normal">({order.quantity}x)</span>
        </h3>
        <p className="text-xs text-gray-400 mt-0.5">{order.product.category}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="font-black text-gray-900 text-sm">R$ {order.totalPrice.toFixed(2)}</p>
        <p className="text-xs text-gray-400 mt-0.5">{date}</p>
      </div>
    </div>
  )
}

function OrderGroup({
  groupId,
  orders,
  onStatusChange,
  onDelete,
  updating,
}: {
  groupId: string
  orders: Order[]
  onStatusChange: (groupId: string, status: OrderStatus) => void
  onDelete: (groupId: string) => void
  updating: boolean
}) {
  const first = orders[0]
  const totalGroup = orders.reduce((s, o) => s + o.totalPrice, 0)
  const cfg = statusConfig[first.status]

  return (
    <div className="flex flex-col gap-2 bg-gray-50 border border-gray-100 rounded-3xl p-4">
      <div className="flex items-center justify-between flex-wrap gap-3 px-1 mb-1">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs font-mono font-bold text-gray-500">
            #{groupId.slice(0, 8).toUpperCase()}
          </span>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${cfg.color}`}>
            {cfg.label}
          </span>
          <span className="text-xs text-gray-400">
            {orders.length} {orders.length === 1 ? "item" : "itens"} · R$ {totalGroup.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">👤 {first.userName}</span>
          <span className="text-xs text-gray-400">📱 {first.userPhone}</span>
          <a
            href={`https://wa.me/55${first.userPhone.replace(/\D/g, "")}`}
            target="_blank"
            rel="noreferrer"
            className="p-1.5 rounded-lg bg-green-50 hover:bg-green-100 text-green-600 transition-all"
          >
            <FaWhatsapp className="text-sm" />
          </a>
          <select
            value={first.status}
            onChange={e => onStatusChange(groupId, e.target.value as OrderStatus)}
            disabled={updating}
            className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-gray-700 focus:outline-none focus:border-gray-400 disabled:opacity-50 cursor-pointer"
          >
            <option value="pending">Pendente</option>
            <option value="paid">Pago</option>
            <option value="shipped">Enviado</option>
            <option value="delivered">Entregue</option>
            <option value="cancelled">Cancelado</option>
          </select>
          <button
            onClick={() => onDelete(groupId)}
            disabled={updating}
            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-all disabled:opacity-40"
          >
            <TbTrash className="text-sm" />
          </button>
          {updating && (
            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {orders.map(order => (
          <OrderCard key={order.id} order={order} />
        ))}
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
  const [search, setSearch] = useState("")

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

  // ✅ função separada, no nível do componente
  async function handleStatusChange(groupId: string, status: OrderStatus) {
    setUpdatingId(groupId)
    try {
      await updateOrderStatus({ groupId, status })
      setOrders(prev => prev.map(o => o.groupId === groupId ? { ...o, status } : o))
    } catch (err: any) {
      alert(err.message ?? "Erro ao atualizar status")
    } finally {
      setUpdatingId(null)
    }
  }

  // ✅ função separada, no nível do componente
  async function handleDelete(groupId: string) {
    if (!confirm("Tem certeza que deseja deletar este pedido?")) return
    try {
      await deleteOrder(groupId)
      setOrders(prev => prev.filter(o => o.groupId !== groupId))
    } catch (err: any) {
      alert(err.message ?? "Erro ao deletar pedido")
    }
  }

  // ✅ no nível do componente
  if (!authorized) return null

  const filtered = orders
    .filter(o => filter === "all" || o.status === filter)
    .filter(o => {
      if (!search.trim()) return true
      const q = search.toLowerCase()
      return (
        o.groupId.toLowerCase().includes(q) ||
        o.userName.toLowerCase().includes(q) ||
        o.userPhone.replace(/\D/g, "").includes(q.replace(/\D/g, "")) ||
        o.product.name.toLowerCase().includes(q)
      )
    })

  const groupedOrders = filtered.reduce((acc, order) => {
    if (!acc[order.groupId]) acc[order.groupId] = []
    acc[order.groupId].push(order)
    return acc
  }, {} as Record<string, Order[]>)

  const pendingCount = orders.filter(o => o.status === "pending").length
  const groupCount = Object.keys(
    orders.reduce((acc, o) => ({ ...acc, [o.groupId]: true }), {} as Record<string, boolean>)
  ).length

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderAdmin />
      <main className="max-w-6xl mx-auto px-4 py-10">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Pedidos</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {groupCount} pedido{groupCount !== 1 ? "s" : ""} · {orders.length} {orders.length === 1 ? "item" : "itens"} no total
            </p>
          </div>
          {pendingCount > 0 && (
            <span className="bg-amber-100 text-amber-700 text-sm font-semibold px-4 py-2 rounded-full border border-amber-200">
              {pendingCount} aguardando
            </span>
          )}
        </div>

        <div className="relative mb-4">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nome, telefone, produto ou ID..."
            className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 pr-10 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-all"
            >
              ✕
            </button>
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
        ) : Object.keys(groupedOrders).length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-3">
            <BiPackage className="text-5xl text-gray-200" />
            <p className="text-gray-400 text-sm">
              {search ? `Nenhum pedido encontrado para "${search}"` : "Nenhum pedido encontrado"}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {Object.entries(groupedOrders).map(([groupId, groupOrders]) => (
              <OrderGroup
                key={groupId}
                groupId={groupId}
                orders={groupOrders}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
                updating={updatingId === groupId}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}