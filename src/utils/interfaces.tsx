export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  quantity: number;
  imageUrls: string[];
  price: number;
}

export interface UpdateProductProps {
  productId: string;
  name?: string;
  description?: string;
  imageUrls?: string[];
  category?: string;
  price?: number;
  key: string;
}


export interface DeleteProductProps {
  id: string;
  key: string;
}

export interface CreateProductProps {
  name: string;
  description: string;
  imageUrls: string[];
  category: string;
  price: number;
  key: string;
}