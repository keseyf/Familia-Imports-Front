import React, { useState, useRef } from "react";
import CreateProductController from "../../controllers/createProduct";
import SuccessNotification from "../../components/common/SuccessNotification";
import ErrorNotification from "../../components/common/ErrorNotification";
import { BiImage, BiX, BiPlus, BiPackage } from "react-icons/bi";

export default function CreateProduct() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [statusResponse, setStatusResponse] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function addFiles(files: FileList | File[]) {
    const arr = Array.from(files).filter(f => f.type.startsWith("image/"));
    const newImages = [...images, ...arr];
    setImages(newImages);
    const newPreviews = arr.map(f => URL.createObjectURL(f));
    setPreviews(prev => [...prev, ...newPreviews]);
  }

  function removeImage(index: number) {
    URL.revokeObjectURL(previews[index]);
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (images.length === 0) {
      setStatusResponse({ type: "error", message: "Selecione ao menos uma imagem." });
      return;
    }
    setLoading(true);
    if(value.includes(",")) {
      setValue(value.replace(",", "."));
    }
    const response = await CreateProductController({
      name,
      description,
      category,
      price: Number(value),
      key,
      images: images,
    });
    setLoading(false);
    setStatusResponse(
  response?.status === 201
    ? { type: "success", message: response?.message ?? "Sucesso!" }
    : { type: "error", message: response?.message ?? "Erro ao criar produto." }
);

    setTimeout(() => {
      setStatusResponse(null);
    }, 4000);
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex items-start justify-center p-6 pt-12">
      <div className="w-full max-w-2xl">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-900 rounded-2xl flex items-center justify-center">
              <BiPackage className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 leading-tight">Criar Produto</h1>
              <p className="text-sm text-gray-400">Preencha os dados do novo produto</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Nome */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Nome do produto</label>
            <input
              type="text"
              placeholder="Ex: Camiseta Oversized Preta"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full border border-zinc-200 bg-white rounded-2xl px-4 py-3.5 outline-none text-gray-800 placeholder-gray-300 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all text-sm"
              required
            />
          </div>

          {/* Descrição */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Descrição</label>
            <textarea
              placeholder="Descreva o produto, materiais, caimento..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full border border-zinc-200 bg-white rounded-2xl px-4 py-3.5 outline-none text-gray-800 placeholder-gray-300 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all text-sm resize-none"
              required
            />
          </div>

          {/* Categoria + Valor */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Categoria</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full border border-zinc-200 bg-white rounded-2xl px-4 py-3.5 outline-none text-gray-800 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all text-sm appearance-none cursor-pointer"
                required
              >
                <option value="">Selecionar...</option>
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
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Valor (R$)</label>
              <input
                type="text"
                placeholder="0,00"
                value={value}
                onChange={e => setValue(e.target.value)}
                className="w-full border border-zinc-200 bg-white rounded-2xl px-4 py-3.5 outline-none text-gray-800 placeholder-gray-300 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all text-sm"
                required
              />
            </div>
          </div>

          {/* Key */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Key de criação</label>
            <input
              type="password"
              placeholder="••••••••"
              value={key}
              onChange={e => setKey(e.target.value)}
              className="w-full border border-zinc-200 bg-white rounded-2xl px-4 py-3.5 outline-none text-gray-800 placeholder-gray-300 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all text-sm"
              required
            />
          </div>

          {/* Upload de imagens */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Fotos do produto
              {images.length > 0 && (
                <span className="ml-2 normal-case text-gray-400 font-normal">{images.length} selecionada{images.length > 1 ? "s" : ""}</span>
              )}
            </label>

            {/* Drop zone */}
            <div
              onDragOver={e => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-200 ${
                dragging
                  ? "border-gray-400 bg-gray-50 scale-[1.01]"
                  : "border-zinc-200 bg-white hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                <BiImage className="text-gray-400 text-xl" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Arraste imagens ou clique para selecionar</p>
                <p className="text-xs text-gray-400 mt-0.5">PNG, JPG, WEBP — múltiplas permitidas</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={e => { if (e.target.files?.length) addFiles(e.target.files) }}
              />
            </div>

            {/* Previews */}
            {previews.length > 0 && (
              <div className="grid grid-cols-4 gap-3 mt-1">
                {previews.map((src, i) => (
                  <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border border-zinc-200">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 w-6 h-6 bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-black"
                    >
                      <BiX className="text-white text-sm" />
                    </button>
                    {i === 0 && (
                      <span className="absolute bottom-1 left-1 text-[10px] bg-black/70 text-white px-1.5 py-0.5 rounded-md font-medium">
                        Principal
                      </span>
                    )}
                  </div>
                ))}

                {/* Botão de adicionar mais */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square rounded-xl border-2 border-dashed border-zinc-200 flex items-center justify-center hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
                >
                  <BiPlus className="text-gray-300 text-2xl" />
                </button>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-semibold text-sm transition-all duration-200 mt-1 ${
              loading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gray-900 text-white hover:bg-gray-700 active:scale-[0.99]"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Processando...
              </span>
            ) : "Criar Produto"}
          </button>

        </form>
      </div>

      {statusResponse?.type === "success" && <SuccessNotification message={statusResponse.message} />}
      {statusResponse?.type === "error" && <ErrorNotification message={statusResponse.message} />}
    </div>
  );
}