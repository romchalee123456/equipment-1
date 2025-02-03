export interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface CartItem extends Product {
  orderQuantity: number;
}

export interface OrderHistory {
  id: string;
  date: string;
  documentNo: string;
  location: string;
  personId: string;
  personName: string;
  items: CartItem[];
  total: number;
}

export interface ApiProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  __v: number;
}

export interface ApiResponse {
  products: ApiProduct[];
}