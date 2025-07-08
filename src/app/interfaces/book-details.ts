export interface Book {
  _id: string;
  title: string;
  author: string;
  image: string;
  stock: number;
  price: number;
  rate?: number;
  category: string;
  description: string;
  reviews: string[];
  pdfPath?: string;
  inventoryStatus?: 'INSTOCK' | 'LOWSTOCK' | 'OUTOFSTOCK';
  isWishListed?: boolean;
}
export interface CartItem {
  book: Book;
  quantity: number;
}
