import { useEffect, useState } from "react";
import Header from "../components/common/Header";
import Cart from "../components/common/Cart";
import type { Product } from "../utils/interfaces";
import { fetchProducts } from "../controllers/getProducts";
import ProductsArea from "../components/elements/ProductsArea";
import { handleAdd } from "../controllers/handleAdd";
import LoadingRoll from "../components/common/LoadingRoll";
import { NewsArea } from "../components/elements/NewsArea";
import Characteristics from "../components/elements/Characteristics";
import Footter from "../components/elements/Footter";
import ProductModal from "../components/common/ProductModal";
import OnAddNottification from "../components/common/OnAddNotificattion";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<Product[]>(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      await fetchProducts({ setLoading, setProducts });
      setLoading(false);
    };
    loadProducts();
  }, []);

  function onAdd(product: Product) {
  handleAdd({ product, setCart });
  setShowNotification(true);
  setTimeout(() => setShowNotification(false), 3000);
}

  return (
    <div>
      <Header />
      <NewsArea />
      <main className="p-5">
        <Characteristics />
        <hr className="border-neutral-200 my-10" />
        {loading ? (
          <LoadingRoll />
        ) : (
          <ProductsArea
            products={products}
            handleAdd={onAdd}
            onClickProduct={(product) => setSelectedProduct(product)}
            onClickEvent={() => {
              setLoading(true);
              fetchProducts({ setLoading, setProducts });
            }}
          />
        )}
        {showNotification && <OnAddNottification message="Produto adicionado ao carrinho!" />}
      </main>
      <Cart cart={cart} setCart={setCart}/>
      <Footter />
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onAdd={onAdd}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}