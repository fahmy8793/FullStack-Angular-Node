import { Book } from './book-details';

export interface OrderItem {
  book: Book;
  quantity: number;
  rating?: number;
  _id: string;
  isReviewed?: boolean;
}

export interface Order {
  _id: string;
  user: string;

  books: OrderItem[];

  total: number;

  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentMethod: string;

  createdAt: string;
  updatedAt: string;
}
