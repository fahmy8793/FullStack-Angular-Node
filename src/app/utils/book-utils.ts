import { Book } from '../interfaces/book-details';

export function getSeverity(book: Book): 'success' | 'warning' | 'danger' | '' {
  switch (book.inventoryStatus) {
    case 'INSTOCK':
      return 'success';
    case 'LOWSTOCK':
      return 'warning';
    case 'OUTOFSTOCK':
      return 'danger';
    default:
      return '';
  }
}
