import axios from "axios";
import type { Product } from "../utils/interfaces";

// Buscar produtos
  export async function fetchProducts({ setLoading, setProducts }: {setLoading: React.Dispatch<React.SetStateAction<boolean>>, setProducts: React.Dispatch<React.SetStateAction<Product[]>>}) {

    try {

      setLoading(true);

      const response = await axios.get(
        "http://localhost:4444/products"
      );
      setProducts(response.data.products);


    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }
  }