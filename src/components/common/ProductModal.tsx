import { useState } from "react";
import type { Product } from "../../utils/interfaces";
import { FiShoppingCart, FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface Props {
  product: Product;
  onAdd: (product: Product) => void;
  onClose: () => void;
}

export default function ProductModal({ product, onAdd, onClose }: Props) {
  const [currentImage, setCurrentImage] = useState(0);
  const images = product.imageUrls ?? [];

  function prev() {
    setCurrentImage(i => (i === 0 ? images.length - 1 : i - 1));
  }

  function next() {
    setCurrentImage(i => (i === images.length - 1 ? 0 : i + 1));
  }

  return (
    // Backdrop
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
    >
      {/* Modal — stop propagation pra não fechar ao clicar dentro */}
      <div
        onClick={e => e.stopPropagation()}
        className="relative bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >

        {/* Botão fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 bg-black/50 hover:bg-black/90 cursor-pointer rounded-full flex items-center justify-center transition-all duration-200"
        >
          <FiX size={15} className="text-gray-100" />
        </button>

        {/* Imagem */}
        <div className="relative w-full aspect-square bg-zinc-100 overflow-hidden">
          <img
            src={images[currentImage]}
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-300"
          />

          {/* Setas — só aparecem se tiver mais de 1 imagem */}
          {images.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute cursor-pointer left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all duration-200 hover:scale-105"
              >
                <FiChevronLeft size={18} />
              </button>
              <button
                onClick={next}
                className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all duration-200 hover:scale-105"
              >
                <FiChevronRight size={18} />
              </button>
            </>
          )}

          {/* Dots */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImage(i)}
                  className={`rounded-full transition-all duration-200 ${
                    i === currentImage
                      ? "w-5 h-2 bg-white"
                      : "w-2 h-2 bg-white/50 hover:bg-white/75"
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
              onClick={() => { onAdd(product); onClose(); }}
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