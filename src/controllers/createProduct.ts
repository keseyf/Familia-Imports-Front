import axios from "axios";

interface CreateProductProps {
  name: string;
  description: string;
  category: string;
  price: number;
  key: string;
  images: File[];
}

export default async function CreateProductController({
  name,
  description,
  category,
  price,
  key,
  images,
}: CreateProductProps) {
  try {
    if (!import.meta.env.VITE_API_URL) {
      throw new Error("VITE_API_URL não está definida no arquivo .env");
    }

    if (!name || !description || !category || !price || images.length === 0) {
      return { status: "error", message: "Todos os campos são obrigatórios" };
    }

    if (!key) {
      return { status: "error", message: "Acesso negado" };
    }

    // 1. Monta o FormData com os arquivos + campos
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("price", String(price));
    formData.append("key", key);
    images.forEach(img => formData.append("imgs", img)); // 👈 cada imagem separada

    // 2. Envia como multipart/form-data
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}create/product`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    if (response.data.status === 201) {
      return { status: 201, message: "Produto criado com sucesso!" };
    } else if (response.data.status === 401) {
      return { status: 401, message: "Key inválida. Acesso negado" };
    } else {
      return { status: 400, message: "Dados inválidos. Verifique as informações." };
    }

  } catch (error: any) {
    console.log(error.response?.data);
    console.log(error.message);
    return { status: "error", message: "Erro ao criar produto." };
  }
}