import axios from "axios";
import type { DeleteProductProps } from "../utils/interfaces";

export default async function DeleteProductController({ id, key }: DeleteProductProps) {
  try {
    if (!import.meta.env.VITE_API_URL) throw new Error("VITE_API_URL não definida");
    if (!id || !key) return { status: 400, message: "ID e key são obrigatórios" };

    const response = await axios.delete(`${import.meta.env.VITE_API_URL}delete/product`, {
      data: { id, key },
    });

    if (response.data.status === 201) return { status: 201, message: `Produto "${response.data.productName}" excluído com sucesso!` };
    if (response.data.status === 401) return { status: 401, message: "Key inválida. Acesso negado." };
    if (response.data.status === 404) return { status: 404, message: "Produto não encontrado." };
    if (response.data.status === 429) return { status: 429, message: "Muitas requisições. Tente novamente em 2 minutos." };

  } catch (error: any) {
    console.log(error.response?.data);
    return { status: 500, message: "Erro ao deletar produto." };
  }
}