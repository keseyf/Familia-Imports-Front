import { FaEye } from "react-icons/fa6";
import type { Product } from "../../utils/interfaces";

interface Props {
  product: Product;
  onAdd: (product: Product) => void;
  onClickProduct: (product: Product) => void;
}

export default function ProductCard({ product, onClickProduct }: Props) {

  return (

    <div onClick={() => onClickProduct(product)} className="shadow-md bg-neutral-50 rounded-2xl w-64 p-2 flex flex-col gap-3 hover:scale-105 duration-150 cursor-pointer">
      <img
        src={product.imageUrls[0]}
        alt={product.name}
        className="w-58 h-58 mt-1 object-cover rounded-2xl"
      />

      <div className="px-2 flex flex-col gap-2 flex-1">

        <div className="h-16 flex flex-col gap-1">
          
          <h1 className="font-semibold text-black whitespace-nowrap overflow-hidden text-ellipsis">
            {product.name}
          </h1>

          <p className="text-neutral-700 text-xs line-clamp-2">
            {product.description}
          </p>

        </div>

        <div className="flex items-center justify-between mt-2">

          <span className="text-black text-lg font-bold">
            R$ {Number(product.price).toFixed(2)}
          </span>

          <button
            className="bg-gray-950 z-30 text-white px-6 py-2 rounded-4xl hover:scale-105 transition cursor-pointer"
          >
            <FaEye size={18} />
          </button>

        </div>

      </div>
    </div>
  );
}