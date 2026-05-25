import type { Product } from "../utils/interfaces";

export function handleAdd({ product, setCart }: { product: Product; setCart: any }) {

  setCart((prev: any) => {

    const existing = prev.find(
      (item: { id: number }) => item.id === product.id
    );

    const updatedCart = existing
      ? prev.map((item: { id: number; quantity: number }) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      : [...prev, { ...product, quantity: 1 }];

    // Salva no localStorage toda vez que o carrinho mudar
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    return updatedCart;
  });
}