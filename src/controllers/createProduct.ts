import axios from "axios";

interface CreateProductProps {
  name: string;
  description: string;
  category: string;
  price: number;
  key: string;
  images: File[]; // array de imagens
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
    if (!name || !description || !category || !price || images.length === 0) {
      return { status: "error", message: "Todos os campos são obrigatórios" };
    }

    if (!key) {
      return { status: "error", message: "Acesso negado" };
    }

    console.log(images)
    const uploadPromises = images.map(async (image) => {
      const formData = new FormData();
      formData.append("image", image);
      return await axios.post(
        "https://api.imgbb.com/1/upload?key=3c8615b541764bd1e082457576e432a8",
        formData
      );
    });

    const uploadResponses = await Promise.all(uploadPromises);
    const imageUrls = uploadResponses.map((res) => res.data.data.url);
    console.log("URLs das imagens:", imageUrls);
    console.log(uploadResponses);

    // Cria produto com array de URLs
    const response = await axios.post(
      "http://localhost:4444/create/product",
      {
        name,
        description,
        imageUrls,      // array com todas as URLs
        category,
        price,
        key,
      }
    );

    console.log(response.data);
    if (response.data.status === 201){
      return { status: response.data.status, message: "Sucesso! Produto criado com sucesso! Redirecionando..." };
    }else if (response.data.status === 401){
      return { status: response.data.status, message: "Key inválida. Acesso negado" };
    }else if (response.data.status === 400){
      return { status: response.data.status, message: "Dados inválidos. Verifique as informações e tente novamente." };
    }

  } catch (error: any) {
    console.log(error.response?.data);
    console.log(error.message);

    return {
      status: "error",
      message: "Erro ao criar produto. Verifique os dados e tente novamente.",
    };
  }
}