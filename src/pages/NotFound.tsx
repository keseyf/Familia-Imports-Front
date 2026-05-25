import { useEffect, useState } from "react";

export default function NotFound() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 50);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center px-6 overflow-hidden">

      {/* Número 404 gigante de fundo */}
      <div
        className={`absolute select-none pointer-events-none font-black text-[20rem] leading-none text-zinc-100 transition-all duration-1000 ${
          visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        404
      </div>

      {/* Conteúdo */}
      <div className="relative flex flex-col items-center gap-5 text-center">

        {/* Ícone animado */}
        <div
          className={`transition-all duration-700 delay-100 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="w-20 h-20 bg-gray-900 rounded-3xl flex items-center justify-center shadow-xl animate-bounce">
            <span className="text-4xl">🧭</span>
          </div>
        </div>

        {/* Textos */}
        <div
          className={`flex flex-col gap-2 transition-all duration-700 delay-200 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <h1 className="text-4xl font-black tracking-tighter text-gray-900 uppercase">
            Página não encontrada
          </h1>
          <p className="text-gray-400 text-sm tracking-widest uppercase">
            Parece que você entrou em um caminho sem saída
          </p>
        </div>

        {/* Linha decorativa */}
        <div
          className={`h-px w-24 from-transparent via-gray-400 to-transparent transition-all duration-700 delay-300 ${
            visible ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
          }`}
        />

        {/* Botão */}
        <div
          className={`transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <a
            href="/"
            className="inline-flex items-center gap-2 bg-accent text-white text-sm font-semibold px-8 py-4 rounded-2xl hover:shadow-accent shadow-2xl active:scale-95 transition-all duration-200"
          >
            ← Voltar para a loja
          </a>
        </div>

      </div>
    </div>
  );
}