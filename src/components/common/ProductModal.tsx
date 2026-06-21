import { useState, useEffect } from "react";
import type { Product } from "../../utils/interfaces";
import { FiShoppingCart, FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface Props {
  product: Product;
  onAdd: (product: Product) => void;
  onClose: () => void;
}

export default function ProductModal({ product, onAdd, onClose }: Props) {
  const [currentImage, setCurrentImage] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [visible, setVisible] = useState(false);
  const images = product.imageUrls ?? [];

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    images.forEach(url => {
      const img = new Image()
      img.src = url
    })
  }, [])

  useEffect(() => {
    setImgLoaded(false)
  }, [currentImage])

  // Fecha com animação antes de desmontar
  function handleClose() {
    setVisible(false)
    setTimeout(onClose, 300) // aguarda a animação terminar
  }

  function prev() {
    setCurrentImage(i => (i === 0 ? images.length - 1 : i - 1));
  }

  function next() {
    setCurrentImage(i => (i === images.length - 1 ? 0 : i + 1));
  }

  return (
    <div
      onClick={handleClose} // 👈 era onClose
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 transition-all duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        onClick={e => e.stopPropagation()}
        className={`relative bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden transition-all duration-300 ${
          visible ? "opacity-100 scale-90 translate-y-0" : "opacity-0 scale-95 translate-y-4"
        }`}
      >
        {/* Botão fechar */}
        <button
          onClick={handleClose} // 👈 era onClose
          className="absolute top-4 right-4 z-10 w-8 h-8 bg-black/50 hover:bg-black/90 cursor-pointer rounded-full flex items-center justify-center transition-all duration-200"
        >
          <FiX size={15} className="text-gray-100" />
        </button>

        {/* Imagem */}
        <div className="relative w-full aspect-square bg-zinc-100 overflow-hidden">
          {!imgLoaded && (
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-zinc-100">
              <div className="w-8 h-8 border-2 border-zinc-300 border-t-zinc-600 rounded-full animate-spin" />
            </div>
          )}
          <img
            key={currentImage}
            src={images[currentImage]}
            alt={product.name}
            onLoad={() => setImgLoaded(true)}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imgLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
          {images.length > 1 && (
            <>
              <button onClick={prev} className="absolute cursor-pointer left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all duration-200 hover:scale-105">
                <FiChevronLeft size={18} />
              </button>
              <button onClick={next} className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all duration-200 hover:scale-105">
                <FiChevronRight size={18} />
              </button>
            </>
          )}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImage(i)}
                  className={`rounded-full transition-all duration-200 ${
                    i === currentImage ? "w-5 h-2 bg-white" : "w-2 h-2 bg-white/50 hover:bg-white/75"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 px-5 pt-4 overflow-x-auto scrollbar-hide">
            {images.map((url, i) => (
              <button
                key={i}
                onClick={() => setCurrentImage(i)}
                className={`shrink-0 w-14 h-14 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                  i === currentImage ? "border-gray-900 scale-105" : "border-transparent opacity-50 hover:opacity-75"
                }`}
              >
                <img src={url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Info */}
        <div className="px-5 pt-4 pb-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] tracking-[0.2em] uppercase text-gray-400 font-medium">
              {product.category}
            </span>
            <h1 className="text-xl font-black tracking-tight text-neutral-900 leading-tight">
              {product.name}
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed mt-1">
              {product.description}
            </p>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <span className="text-2xl font-black text-neutral-900 tracking-tight">
              R$ {Number(product.price).toFixed(2)}
            </span>
            <button
              onClick={() => { onAdd(product); handleClose(); }} // 👈 era onClose
              className="flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-2xl hover:bg-gray-700 active:scale-95 transition-all duration-200 text-sm font-semibold"
            >
              <FiShoppingCart size={16} />
              Adicionar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}