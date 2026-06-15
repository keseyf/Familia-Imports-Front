import { useEffect } from "react";
import ScrollReveal from "scrollreveal";
import type { Product } from "../../utils/interfaces";
import ProductCard from "../common/ProductCard";

const categoryConfig: Record<string, { title: string; subtitle: string }> = {
  camisetas: {
    title: "Camisetas",
    subtitle: "Mais que tecido, identidade.",
  },
  calcas: {
    title: "Calças",
    subtitle: "Caimento que impõe presença.",
  },
  short: {
    title: "Shorts",
    subtitle: "Leveza para qualquer ocasião.",
  },
  conjunto: {
    title: "Conjuntos",
    subtitle: "Tudo combina. Nada é comum.",
  },
  bobojaco: {
    title: "Bobojacos",
    subtitle: "Proteção para os dias mais frios.",
  },
  moletom: {
    title: "Moletons",
    subtitle: "Conforto que acompanha seu ritmo.",
  },
  jaqueta: {
    title: "Jaquetas",
    subtitle: "Camadas que carregam atitude.",
  },
  tenis: {
    title: "Tênis",
    subtitle: "Cada passo deixa uma marca.",
  },
  acessorios: {
    title: "Acessórios",
    subtitle: "Os detalhes fazem a diferença.",
  },
};

export default function ProductsArea({
  products,
  handleAdd,
  onClickEvent,
  onClickProduct,
}: {
  products: Product[];
  handleAdd: any;
  onClickEvent: () => void;
  onClickProduct: (product: Product) => void;
}) {
  useEffect(() => {
    ScrollReveal().reveal(".category-header", {
      delay: 100,
      duration: 700,
      distance: "30px",
      origin: "left",
    });
    ScrollReveal().reveal(".products-row", {
      delay: 200,
      duration: 600,
      distance: "40px",
      origin: "bottom",
    });
  }, []);

  const groupedProducts = {
    camisetas: products.filter(p => p.category?.toLowerCase() === "camisetas"),
    calcas: products.filter(p => p.category?.toLowerCase() === "calcas"),
    short: products.filter(p => p.category?.toLowerCase() === "short"),
    conjunto: products.filter(p => p.category?.toLowerCase() === "conjunto"),
    bobojaco: products.filter(p => p.category?.toLowerCase() === "bobojaco"),
    moletom: products.filter(p => p.category?.toLowerCase() === "moletom"),
    jaqueta: products.filter(p => p.category?.toLowerCase() === "jaqueta"),
    tenis: products.filter(p => p.category?.toLowerCase() === "tenis"),
    acessorios: products.filter(p => p.category?.toLowerCase() === "acessorios"),
  };
  const sortedCategories = Object.entries(groupedProducts)
    .filter(([, categoryProducts]) => categoryProducts.length > 0)
    .sort((a, b) => b[1].length - a[1].length);

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-6">
        <p className="text-4xl font-black tracking-tighter text-gray-800 uppercase">
          Sem produtos
        </p>
        <p className="text-sm text-gray-500 tracking-widest uppercase">
          Nenhum item encontrado
        </p>
        <button
          onClick={onClickEvent}
          className="mt-2 bg-gray-700 text-gray-200 text-xs tracking-widest uppercase px-8 py-3 hover:bg-white hover:text-black border border-transparent cursor-pointer hover:border-gray-800 transition-all duration-300"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div id="products-area" className="flex flex-col">
      {sortedCategories.map(([category, categoryProducts], sectionIndex) => {
        const config = categoryConfig[category] ?? { title: category, subtitle: "" };

        return (
          <section
            id={category}
            key={category}
            className={`py-6`}
          >
            {/* Category header */}
            <div className="category-header px-6 md:px-12 mb-10 flex items-end justify-between gap-1">
              <div className="flex flex-col gap-1">
                {/* Número da seção */}
                <span className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase">
                  {String(sectionIndex + 1).padStart(2, "0")} — Coleção
                </span>

                <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-gray-900 leading-none uppercase">
                  {config.title}
                </h2>

                <p className="text-xs tracking-[0.2em] text-gray-500 uppercase mt-1">
                  {config.subtitle}
                </p>
              </div>

              {/* Linha decorativa */}
              <div className="hidden md:flex flex-1 items-center gap-3 mb-3">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-xs text-gray-500 tracking-widest uppercase whitespace-nowrap">
                  {categoryProducts.length} {categoryProducts.length === 1 ? "item" : "itens"}
                </span>
              </div>
            </div>

            {/* Products scroll row */}
            <div className="products-row px-6 md:px-12">
              <div className="flex flex-row gap-5 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
                {categoryProducts.map((product) => (
                  <div
                    key={product.id}
                    className="snap-start"
                  >
                    <ProductCard product={product} onAdd={handleAdd} onClickProduct={onClickProduct} />
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom border accent */}
            <div className="px-6 md:px-12 mt-10">
              <div className="h-px from-gray-900 to-transparent w-full" />
            </div>
          </section>
        );
      })}
    </div>
  );
}