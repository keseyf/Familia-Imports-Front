import { useEffect, useState, useRef } from "react"
import type { Product } from "../../utils/interfaces"
import ProductCard from "../common/ProductCard"
import { fetchProductsByCategory, fetchCategoryCounts } from "../../controllers/getProducts"

const categoryConfig: Record<string, { title: string; subtitle: string }> = {
  camisetas:  { title: "Camisetas",   subtitle: "Mais que tecido, identidade." },
  calcas:     { title: "Calças",      subtitle: "Caimento que impõe presença." },
  short:      { title: "Shorts",      subtitle: "Leveza para qualquer ocasião." },
conjuntoM: { title: "Conjuntos Masculinos", subtitle: "Coordenação que fala por você." },
conjuntoF: { title: "Conjuntos Femininos",  subtitle: "Harmonia que vira estilo." },
  bobojaco:   { title: "Bobojacos",   subtitle: "Proteção para os dias mais frios." },
  moletom:    { title: "Moletons",    subtitle: "Conforto que acompanha seu ritmo." },
  jaqueta:    { title: "Jaquetas",    subtitle: "Camadas que carregam atitude." },
  tenis:      { title: "Tênis",       subtitle: "Cada passo deixa uma marca." },
  acessorios: { title: "Acessórios",  subtitle: "Os detalhes fazem a diferença." },
}

function CategorySection({
  category,
  index,
  onClickProduct,
  handleAdd,
}: {
  category: string
  index: number
  onClickProduct: (p: Product) => void
  handleAdd: (p: Product) => void
}) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [page, setPage] = useState(1)
  const [triggered, setTriggered] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const config = categoryConfig[category]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered) {
          setTriggered(true)
          loadProducts(1)
        }
      },
      { rootMargin: "200px" }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  async function loadProducts(p: number) {
    setLoading(true)
    try {
      const data = await fetchProductsByCategory(category, p)
      setProducts(prev => p === 1 ? data.products : [...prev, ...data.products])
      setHasMore(data.hasMore)
      setPage(p)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id={category} ref={sectionRef} className="py-6">
      <div className="px-6 md:px-12 mb-10 flex items-end justify-between gap-1">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase">
            {String(index + 1).padStart(2, "0")} — Coleção
          </span>
          <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-gray-900 leading-none uppercase">
            {config.title}
          </h2>
          <p className="text-xs tracking-[0.2em] text-gray-500 uppercase mt-1">
            {config.subtitle}
          </p>
        </div>
        <div className="hidden md:flex flex-1 items-center gap-3 mb-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-500 tracking-widest uppercase whitespace-nowrap">
            {products.length} {products.length === 1 ? "item" : "itens"}
          </span>
        </div>
      </div>

      <div className="px-6 md:px-12">
        {loading && products.length === 0 ? (
          <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="shrink-0 w-52 h-72 bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="flex flex-row gap-5 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
            {products.map(product => (
              <div key={product.id} className="snap-start">
                <ProductCard product={product} onAdd={handleAdd} onClickProduct={onClickProduct} />
              </div>
            ))}
            {hasMore && (
              <div className="snap-start shrink-0 flex items-center justify-center w-40">
                <button
                  onClick={() => loadProducts(page + 1)}
                  disabled={loading}
                  className="flex flex-col items-center gap-2 text-gray-400 hover:text-gray-700 transition-all disabled:opacity-40"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                  ) : (
                    <>
                      <span className="text-2xl">→</span>
                      <span className="text-xs tracking-widest uppercase">Ver mais</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="px-6 md:px-12 mt-10">
        <div className="h-px bg-gray-100 w-full" />
      </div>
    </section>
  )
}

export default function ProductsArea({
  handleAdd,
  onClickProduct,
}: {
  handleAdd: (p: Product) => void
  onClickProduct: (product: Product) => void
}) {
  const [sortedCategories, setSortedCategories] = useState<string[]>([])

  useEffect(() => {
    fetchCategoryCounts().then(counts => {
      const filtered = counts
        .filter(c => c.total > 0)              // remove categorias vazias
        .sort((a, b) => b.total - a.total)     // ordena por mais produtos
        .map(c => c.category)
      setSortedCategories(filtered)
    })
  }, [])

  // Skeleton das seções enquanto carrega os counts
  if (sortedCategories.length === 0) {
    return (
      <div className="flex flex-col gap-16 py-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="px-6 md:px-12 flex flex-col gap-4">
            <div className="h-14 w-64 bg-gray-100 rounded-xl animate-pulse" />
            <div className="flex gap-5">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="shrink-0 w-52 h-72 bg-gray-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div id="products-area" className="flex flex-col">
      {sortedCategories.map((category, index) => (
        <CategorySection
          key={category}
          category={category}
          index={index}
          handleAdd={handleAdd}
          onClickProduct={onClickProduct}
        />
      ))}
    </div>
  )
}