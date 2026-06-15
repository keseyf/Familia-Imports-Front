import { useState, useEffect } from "react"
import { BiShoppingBag, BiX } from "react-icons/bi"
import type { Product } from "../../utils/interfaces"
import { TbTrash } from "react-icons/tb"
import { createOrder } from "../../controllers/createOrder"

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3333"
const WHATSAPP_NUMBER = "5531972162133"

export default function Cart({
  cart,
  setCart,
}: {
  cart: Product[]
  setCart: React.Dispatch<React.SetStateAction<Product[]>>
}) {
  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(false)

  // Modal de checkout
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [userName, setUserName] = useState("")
  const [userPhone, setUserPhone] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const itemCount = cart.length
  const total = cart
    .reduce((sum, p) => sum + p.price * p.quantity, 0)
    .toFixed(2)

  useEffect(() => {
    if (open) setTimeout(() => setVisible(true), 10)
    else setVisible(false)
  }, [open])

  function removeOne(id: string) {
    setCart((prev) => {
      const updated = prev
        .map((p) => (String(p.id) === id ? { ...p, quantity: p.quantity - 1 } : p))
        .filter((p) => p.quantity > 0)
      localStorage.setItem("cart", JSON.stringify(updated))
      return updated
    })
  }

  function clearCart() {
    setCart([])
    localStorage.removeItem("cart")
  }

  function openCheckout() {
    if (cart.length === 0) return
    setError("")
    setCheckoutOpen(true)
  }

  async function confirmOrder() {
  if (!userName.trim() || !userPhone.trim()) {
    setError("Preencha seu nome e telefone.")
    return
  }

  setLoading(true)
  setError("")

  try {
    const result = await createOrder({
      items: cart.map((p) => ({
        productId: String(p.id),
        quantity: p.quantity,
        totalPrice: p.price * p.quantity,
      })),
      userName,
      userPhone,
    })

    const orderIds = result.orders
      .map((o: { id: string }) => `#${o.id.slice(0, 8).toUpperCase()}`)
      .join(" / ")

    const itemsList = cart
      .map((p) => `• ${p.name} (${p.quantity}x) — R$ ${(p.price * p.quantity).toFixed(2)}`)
      .join("\n")

    const message =
      `Olá! Meu nome é *${userName}*.\n` +
      `🆔 *Pedido:* ${orderIds}\n\n` +
      `🛍️ *Itens:*\n${itemsList}\n\n` +
      `💰 *Total: R$ ${total}*\n\n` +
      `Aguardo orientações para pagamento! 🙏`

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      "_blank"
    )

    clearCart()
    setCheckoutOpen(false)
    setUserName("")
    setUserPhone("")
    setOpen(false)
  } catch (err: any) {
    setError(err.message ?? "Erro inesperado. Tente novamente.")
  } finally {
    setLoading(false)
  }
}

  return (
    <>
      {/* Overlay do carrinho */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-all duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
      />

      {/* Painel do carrinho */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${visible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
          }`}
      >
        <div className="mx-3 mb-24 bg-white rounded-3xl shadow-2xl border border-black/10 overflow-hidden">
          {/* Header */}
          <div className="flex items-center flex-col w-full justify-between px-6 py-4 border-b border-neutral-100">
            <div className="flex items-center gap-2 w-full justify-between">
              <div className="flex items-center gap-3">
                <BiShoppingBag className="text-xl text-neutral-700" />
                <span className="font-semibold text-neutral-800 text-base">Carrinho</span>
                {itemCount > 0 && (
                  <span className="text-xs bg-neutral-900 text-white font-bold px-2 py-0.5 rounded-full">
                    {itemCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 flex-row-reverse">
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-xl hover:bg-neutral-100 text-neutral-500 transition-all duration-200"
                >
                  <BiX className="text-xl" />
                </button>
                <button
                  onClick={clearCart}
                  className="border border-red-500 text-red-500 rounded-4xl p-3"
                >
                  <TbTrash />
                </button>
              </div>
            </div>
            {Number(total) > 0 && (
              <h3 className="text-sm mt-5 md:text-base font-black tracking-tighter text-gray-900 leading-none uppercase">
                Subtotal: R$ {total}
              </h3>
            )}
          </div>

          {/* Itens */}
          <div className="px-6 py-6 min-h-40 overflow-y-auto max-h-72">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 gap-2">
                <BiShoppingBag className="text-4xl text-neutral-200" />
                <p className="text-sm text-neutral-400 tracking-wide">Seu carrinho está vazio</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {cart.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-4 p-3 rounded-2xl hover:bg-neutral-50 transition-all duration-200"
                  >
                    <img
                      src={product.imageUrls[0]}
                      alt={product.name}
                      className="w-14 h-14 object-cover rounded-xl border border-neutral-100"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm text-neutral-800 truncate">
                        {product.name}{" "}
                        <span className="text-xs text-neutral-400">({product.quantity}x)</span>
                      </h3>
                      <p className="text-xs text-neutral-400 uppercase tracking-wider">
                        {product.category}
                      </p>
                    </div>
                    <span className="text-sm font-black text-neutral-900 shrink-0">
                      R$ {product.price.toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeOne(String(product.id))}
                      className="w-6 h-6 rounded-full bg-neutral-100 hover:bg-red-100 hover:text-red-500 text-neutral-400 flex items-center justify-center transition-all duration-200 text-sm font-bold shrink-0"
                    >
                      −
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 w-full flex-col flex items-center justify-center py-4 border-t border-neutral-100">
            <button
              onClick={openCheckout}
              disabled={cart.length === 0}
              className="w-full text-center bg-neutral-900 text-white font-semibold py-3.5 rounded-2xl hover:bg-neutral-700 transition-all duration-200 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Finalizar compra
            </button>
          </div>
        </div>
      </div>

      {/* Botão flutuante */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`fixed cursor-pointer bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-4 rounded-full shadow-2xl transition-all duration-300 ${open ? "bg-accent scale-95" : "bg-accent hover:scale-105 hover:shadow-black/40"
          }`}
      >
        <BiShoppingBag className="text-white text-xl" />
        <span className="text-white text-sm font-semibold">Carrinho</span>
        {itemCount > 0 && (
          <span className="bg-white text-neutral-900 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </button>

      {/* Modal de checkout */}
      {checkoutOpen && (
        <>
          <div
            className="fixed inset-0 z-60 bg-black/40 backdrop-blur-sm"
            onClick={() => !loading && setCheckoutOpen(false)}
          />
          <div className="fixed inset-0 z-60 flex items-end justify-center px-3 pb-8">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-neutral-800 text-lg">Dados para o pedido</h2>
                <button
                  onClick={() => !loading && setCheckoutOpen(false)}
                  className="p-2 rounded-xl hover:bg-neutral-100 text-neutral-400"
                >
                  <BiX className="text-xl" />
                </button>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Seu nome
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Maria Silva"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="border border-neutral-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-neutral-400 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Seu WhatsApp
                  </label>
                  <input
                    type="tel"
                    placeholder="Ex: 31999999999"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    className="border border-neutral-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-neutral-400 transition-all"
                  />
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-xs font-medium text-center">{error}</p>
              )}

              <button
                onClick={confirmOrder}
                disabled={loading}
                className="w-full bg-neutral-900 text-white font-semibold py-3.5 rounded-2xl hover:bg-neutral-700 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Enviando pedido..." : "Confirmar e ir para o WhatsApp"}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}