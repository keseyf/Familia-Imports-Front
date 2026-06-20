import { useEffect, useState } from "react"
import { BiXCircle, BiX } from "react-icons/bi"

interface Props {
  message: string
  description?: string
  duration?: number
  onClose: () => void
}

export default function ErrorNotificarion({
  message,
  description,
  duration = 3000,
  onClose,
}: Props) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const tIn  = setTimeout(() => setVisible(true), 10)
    const tOut = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 400)
    }, duration)
    return () => { clearTimeout(tIn); clearTimeout(tOut) }
  }, [])

  return (
    <div className={`fixed top-5 right-5 z-[999] transition-all duration-400 ease-out ${
      visible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
    }`}>
      <div className="relative bg-white border border-red-100 rounded-2xl shadow-lg p-4 flex items-start gap-3 w-[300px] overflow-hidden">

        {/* Ícone */}
        <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center shrink-0">
          <BiXCircle className="text-red-600 text-xl" />
        </div>

        {/* Texto */}
        <div className="flex-1 min-w-0 pt-0.5">
          <p className="text-sm font-semibold text-red-900 leading-tight">{message}</p>
          {description && (
            <p className="text-xs text-red-400 mt-1 leading-snug">{description}</p>
          )}
        </div>

        {/* Fechar */}
        <button
          onClick={() => { setVisible(false); setTimeout(onClose, 400) }}
          className="text-red-300 hover:text-red-500 transition-colors shrink-0"
        >
          <BiX className="text-lg" />
        </button>

        {/* Barra de progresso */}
        <div
          className="absolute bottom-0 left-0 h-[3px] bg-red-400 rounded-b-2xl"
          style={{ animation: `shrink ${duration}ms linear forwards` }}
        />
      </div>

      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
    </div>
  )
}