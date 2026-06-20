import { useState, useEffect } from "react";
import { BiPackage, BiEdit, BiTrash, BiPlus, BiChevronLeft, BiChevronRight } from "react-icons/bi";
import CreateProduct from "../admin/createProduct";
import HeaderAdmin from "../../components/common/HeaderA";
import AdminLogin from "../../components/elements/AdminLogin";
import UpdateProductController from "../../controllers/updateProduct";
import DeleteProductController from "../../controllers/deleteProduct";
import { fetchProducts } from "../../controllers/getProducts";
import SuccessNotification from "../../components/common/SuccessNotification";
import ErrorNotification from "../../components/common/ErrorNotification";
import type { Product } from "../../utils/interfaces";
import axios from "axios";

type Tab = "criar" | "atualizar" | "deletar";

export default function AdminPage() {
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("criar");
  const [statusResponse, setStatusResponse] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [updateName, setUpdateName] = useState("");
  const [updateDescription, setUpdateDescription] = useState("");
  const [updateCategory, setUpdateCategory] = useState("");
  const [updatePrice, setUpdatePrice] = useState("");
  const [updateKey, setUpdateKey] = useState("");
  const [deleteKey, setDeleteKey] = useState("");

  // Verifica se é admin ao montar

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      setAuthorized(false);
      setChecking(false);
      return;
    }
    axios.get(`${import.meta.env.VITE_API_URL}admin/verify`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => setAuthorized(true))
      .catch(() => {
        localStorage.removeItem("adminToken");
        setAuthorized(false);
      })
      .finally(() => setChecking(false));
  }, []);


  useEffect(() => {
    if (activeTab === "atualizar" || activeTab === "deletar") {
      fetchProducts({ setLoading: setProductsLoading, setProducts });
      setSelectedProduct(null);
      setCarouselIndex(0);
    }
  }, [activeTab]);

  // Carregando verificação
  if (checking) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <svg className="animate-spin w-8 h-8 text-gray-300" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      </div>
    );
  }

  if (!authorized) return <AdminLogin />;

  function notify(type: "success" | "error", message: string) {
    setStatusResponse({ type, message });
    setTimeout(() => setStatusResponse(null), 4000);
  }

  function selectProduct(product: Product) {
    setSelectedProduct(product);
    if (activeTab === "atualizar") {
      setUpdateName(product.name ?? "");
      setUpdateDescription(product.description ?? "");
      setUpdateCategory(product.category ?? "");
      setUpdatePrice(product.price?.toString() ?? "");
    }
  }

  const VISIBLE = 3;
  const canPrev = carouselIndex > 0;
  const canNext = carouselIndex + VISIBLE < products.length;

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedProduct) return notify("error", "Selecione um produto.");
    setLoading(true);
    const response = await UpdateProductController({
      productId: String(selectedProduct.id),
      name: updateName || undefined,
      description: updateDescription || undefined,
      category: updateCategory || undefined,
      price: updatePrice ? Number(updatePrice.replace(",", ".")) : undefined,
      key: updateKey,
    });
    setLoading(false);
    response?.status === 200
      ? notify("success", response.message!)
      : notify("error", response?.message ?? "Erro ao atualizar.");
  }

  async function handleDelete(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedProduct) return notify("error", "Selecione um produto.");
    setLoading(true);
    const response = await DeleteProductController({ id: String(selectedProduct.id), key: deleteKey });
    setLoading(false);
    if (response?.status === 201) {
      notify("success", response.message!);
      setSelectedProduct(null);
      setDeleteKey("");
      fetchProducts({ setLoading: setProductsLoading, setProducts });
    } else {
      notify("error", response?.message ?? "Erro ao deletar.");
    }
  }

  const inputClass = "w-full border border-zinc-200 bg-white rounded-2xl px-4 py-3.5 outline-none text-gray-800 placeholder-gray-300 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all text-sm";
  const labelClass = "text-xs font-semibold text-gray-500 uppercase tracking-wider";

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "criar", label: "Criar", icon: <BiPlus className="text-lg" /> },
    { id: "atualizar", label: "Atualizar", icon: <BiEdit className="text-lg" /> },
    { id: "deletar", label: "Deletar", icon: <BiTrash className="text-lg" /> },
  ];

  function ProductCarousel({ accent }: { accent?: string }) {
    return (
      <div className="flex flex-col gap-3">
        <label className={labelClass}>Selecione o produto</label>

        {productsLoading ? (
          <div className="flex items-center justify-center py-10">
            <svg className="animate-spin w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          </div>
        ) : products.length === 0 ? (
          <div className="flex items-center justify-center py-10 text-sm text-gray-400">
            Nenhum produto encontrado.
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCarouselIndex(i => i - 1)}
                disabled={!canPrev}
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-zinc-200 bg-white text-gray-400 hover:text-gray-700 hover:border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <BiChevronLeft className="text-xl" />
              </button>

              <div className="flex-1 grid grid-cols-3 gap-3 overflow-hidden">
                {products.slice(carouselIndex, carouselIndex + VISIBLE).map(product => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => selectProduct(product)}
                    className={`flex flex-col rounded-2xl border-2 overflow-hidden text-left transition-all duration-200 ${selectedProduct?.id === product.id
                        ? accent === "red"
                          ? "border-red-500 shadow-md shadow-red-100"
                          : "border-gray-900 shadow-md shadow-gray-100"
                        : "border-zinc-200 hover:border-gray-300"
                      }`}
                  >
                    <div className="aspect-square w-full bg-zinc-100 overflow-hidden">
                      {product.imageUrls?.[0] ? (
                        <img src={product.imageUrls[0]} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BiPackage className="text-zinc-300 text-3xl" />
                        </div>
                      )}
                    </div>
                    <div className="p-2">
                      <p className="text-xs font-semibold text-gray-800 truncate">{product.name}</p>
                      <p className="text-xs text-gray-400">R$ {product.price}</p>
                    </div>
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setCarouselIndex(i => i + 1)}
                disabled={!canNext}
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-zinc-200 bg-white text-gray-400 hover:text-gray-700 hover:border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <BiChevronRight className="text-xl" />
              </button>
            </div>

            {/* Indicador */}
            <div className="flex justify-center gap-1.5">
              {Array.from({ length: Math.ceil(products.length / VISIBLE) }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCarouselIndex(i * VISIBLE)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${Math.floor(carouselIndex / VISIBLE) === i ? "bg-gray-900 w-4" : "bg-zinc-300"
                    }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Produto selecionado */}
        {selectedProduct && (
          <div className={`flex items-center gap-3 p-3 rounded-2xl border ${accent === "red" ? "bg-red-50 border-red-100" : "bg-gray-50 border-zinc-200"}`}>
            <img
              src={selectedProduct.imageUrls?.[0] ?? ""}
              alt={selectedProduct.name}
              className="w-10 h-10 rounded-xl object-cover bg-zinc-200"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{selectedProduct.name}</p>
              <p className="text-xs text-gray-400 truncate">{selectedProduct.id}</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <HeaderAdmin />

      <div className="flex items-start justify-center p-6 pt-12">
        <div className="w-full max-w-2xl">

          {/* Header */}
          <div className="mb-8 flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-900 rounded-2xl flex items-center justify-center">
              <BiPackage className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 leading-tight">Painel Admin</h1>
              <p className="text-sm text-gray-400">Gerencie os produtos da loja</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 bg-white border border-zinc-200 rounded-2xl p-1.5">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${activeTab === tab.id ? "bg-gray-900 text-white shadow-sm" : "text-gray-400 hover:text-gray-600"
                  }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab: Criar */}
          {activeTab === "criar" && <CreateProduct />}

          {/* Tab: Atualizar */}
          {activeTab === "atualizar" && (
            <form onSubmit={handleUpdate} className="flex flex-col gap-5">
              <ProductCarousel />
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Nome</label>
                <input className={inputClass} placeholder="Deixe em branco para não alterar" value={updateName} onChange={e => setUpdateName(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Descrição</label>
                <textarea className={`${inputClass} resize-none`} placeholder="Deixe em branco para não alterar" value={updateDescription} onChange={e => setUpdateDescription(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Categoria</label>
                  <select className={inputClass} value={updateCategory} onChange={e => setUpdateCategory(e.target.value)}>
                    <option disabled value="">Selecionar...</option>
                    <option value="camisetas">Camiseta</option>
                    <option value="calcas">Calças</option>
                    <option value="short">Short</option>
                    <option value="conjunto">Conjunto</option>
                    <option value="bobojaco">Bobojaco</option>
                    <option value="moletom">Moletom</option>
                    <option value="jaqueta">Jaqueta</option>
                    <option value="tenis">Tênis</option>
                    <option value="acessorios">Acessórios</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Valor (R$)</label>
                  <input className={inputClass} placeholder="Deixe em branco para não alterar" value={updatePrice} onChange={e => setUpdatePrice(e.target.value)} />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Key de autenticação *</label>
                <input type="password" className={inputClass} placeholder="••••••••" value={updateKey} onChange={e => setUpdateKey(e.target.value)} required />
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-2xl font-semibold text-sm transition-all duration-200 mt-1 ${loading ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gray-900 text-white hover:bg-gray-700 active:scale-[0.99]"
                  }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Processando...
                  </span>
                ) : "Atualizar Produto"}
              </button>
            </form>
          )}

          {/* Tab: Deletar */}
          {activeTab === "deletar" && (
            <form onSubmit={handleDelete} className="flex flex-col gap-5">
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl">
                <p className="text-sm text-red-500 font-medium">⚠️ Atenção: essa ação é irreversível.</p>
              </div>
              <ProductCarousel accent="red" />
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Key de autenticação *</label>
                <input type="password" className={inputClass} placeholder="••••••••" value={deleteKey} onChange={e => setDeleteKey(e.target.value)} required />
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-2xl font-semibold text-sm transition-all duration-200 mt-1 ${loading ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-red-600 text-white hover:bg-red-500 active:scale-[0.99]"
                  }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Processando...
                  </span>
                ) : "Deletar Produto"}
              </button>
            </form>
          )}

        </div>
      </div>

      {statusResponse?.type === "success" && <SuccessNotification onClose={()=>{}} message={statusResponse.message} />}
      {statusResponse?.type === "error" && <ErrorNotification onClose={()=>{}} message={statusResponse.message} />}
    </div>
  );
}