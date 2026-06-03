import axios from "axios";
import type { UpdateProductProps } from "../utils/interfaces";

export default async function UpdateProductController({
  productId,
  name,
  description,
  imageUrls,
  category,
  price,
  key,
}: UpdateProductProps) {
  try {
    if (!import.meta.env.VITE_API_URL) throw new Error("VITE_API_URL não definida");
    if (!key || !productId) return { status: 400, message: "ID e key são obrigatórios" };

    const response = await axios.put(`${import.meta.env.VITE_API_URL}update/product`, {
      productId: String(productId),
      name,
      description,
      imageUrls,
      category,
      price,
      key,
    });

    if (response.data.status === 200) return { status: 200, message: "Produto atualizado com sucesso!" };
    if (response.data.status === 401) return { status: 401, message: "Key inválida. Acesso negado." };
    if (response.data.status === 400) return { status: 400, message: "Dados inválidos." };
    if (response.data.status === 429) return { status: 429, message: "Muitas requisições. Tente novamente em 2 minutos." };

  } catch (error: any) {
    console.log(error.response?.data);
    return { status: 500, message: "Erro ao atualizar produto." };
  }
}