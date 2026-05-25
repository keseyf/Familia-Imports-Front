import { useState, useEffect } from "react"
import { BiShoppingBag, BiX } from "react-icons/bi"
import type { Product } from "../../utils/interfaces"

export default function Cart({ cart }: { cart: Product[] }) {
  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(false)

  const itemCount = cart.length
  
  const [products] = localStorage.getItem("cart") ? useState<Product[]>(JSON.parse(localStorage.getItem("cart")!)) : useState<Product[]>([])

  useEffect(() => {
    if (open) {
      setTimeout(() => setVisible(true), 10)
    } else {
      setVisible(false)
    }
  }, [open])

  return (
    <>
      {/* Overlay */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-all duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Painel do carrinho */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
          visible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
        }`}
      >
        <div className="mx-3 mb-24 bg-white rounded-3xl shadow-2xl border border-black/10 overflow-hidden">
          {/* Header do painel */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
            <div className="flex items-center gap-2">
              <BiShoppingBag className="text-xl text-neutral-700" />
              <span className="font-semibold text-neutral-800 text-base">Carrinho</span>
              {itemCount > 0 && (
                <span className="text-xs bg-neutral-900 text-white font-bold px-2 py-0.5 rounded-full">
                  {itemCount}
                </span>
              )}
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-2 rounded-xl hover:bg-neutral-100 text-neutral-500 transition-all duration-200"
            >
              <BiX className="text-xl" />
            </button>
          </div>

          {/* Conteúdo */}
<div className="px-6 py-6 min-h-40 overflow-y-auto max-h-72">
  {cart.length === 0 ? (
    <div className="flex flex-col items-center justify-center h-32 gap-2">
      <BiShoppingBag className="text-4xl text-neutral-200" />
      <p className="text-sm text-neutral-400 tracking-wide">Seu carrinho está vazio</p>
    </div>
  ) : (
    <div className="flex flex-col gap-3">
      {cart.map((product: Product) => (
        <div key={product.id} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-neutral-50 transition-all duration-200">
          <img
            src={product.imageUrls[0]}
            alt={product.name}
            className="w-14 h-14 object-cover rounded-xl border border-neutral-100"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-neutral-800 truncate">{product.name}</h3>
            <p className="text-xs text-neutral-400 uppercase tracking-wider">{product.category}</p>
          </div>
          <span className="text-sm font-black text-neutral-900 shrink-0">
            R$ {product.price.toFixed(2)}
          </span>
        </div>
      ))}
    </div>
  )}
</div>
          {/* Footer */}
          <div className="px-6 w-full flex items-center justify-center py-4 border-t border-neutral-100">
            <a href="/checkout" className="w-full text-center bg-neutral-900 text-white font-semibold py-3.5 rounded-2xl hover:bg-neutral-700 transition-all duration-200 text-sm">
              Finalizar compra
            </a>
          </div>
        </div>
      </div>

      {/* Botão flutuante */}
      <button
        onClick={() => setOpen(v => !v)}
        className={`fixed cursor-pointer bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-4 rounded-full shadow-2xl transition-all duration-300
          ${open
            ? "bg-accent scale-95"
            : "bg-accent hover:scale-105 hover:shadow-black/40"
          }
        `}
      >
        <BiShoppingBag className="text-white text-xl" />
        <span className="text-white text-sm font-semibold">Carrinho</span>
        {itemCount > 0 && (
          <span className="bg-white text-neutral-900 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </button>
    </>
  )
}