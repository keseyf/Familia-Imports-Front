import axios from "axios";
import type { Product } from "../utils/interfaces";

// Buscar produtos
  export async function fetchProducts({ setLoading, setProducts }: {setLoading: React.Dispatch<React.SetStateAction<boolean>>, setProducts: React.Dispatch<React.SetStateAction<Product[]>>}) {
    if (!import.meta.env.VITE_API_URL) {
      throw new Error("VITE_API_URL não está definida no arquivo .env");
    }
    try {

      setLoading(true);

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}allProducts`
      );
      setProducts(response.data.products);


    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }
  }