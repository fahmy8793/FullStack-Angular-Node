export interface Book {
  id: string;
  title: string;
  author: string;
  image: string;
  price: number;
  rate: number;
  category: string;
  description: string;
  inventoryStatus?: 'INSTOCK' | 'LOWSTOCK' | 'OUTOFSTOCK';
  isWishListed?: boolean;
}
export interface CartItem extends Book {
  quantity: number;
}
