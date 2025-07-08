import { Injectable } from '@angular/core';
import { Book } from '../interfaces/book-details';

export interface FilterOptions {
  searchQuery?: string;
  selectedCategory?: string;
  sortOption?: 'rate' | 'priceAsc' | 'priceDesc' | '';
}

@Injectable({
  providedIn: 'root',
})
export class FilteringService {
  constructor() {}

  public applyFilters(books: Book[], options: FilterOptions): Book[] {
    let filteredBooks = [...books];

    if (options.searchQuery) {
      filteredBooks = filteredBooks.filter((book) =>
        book.title.toLowerCase().includes(options.searchQuery!.toLowerCase())
      );
    }

    if (options.selectedCategory) {
      filteredBooks = filteredBooks.filter(
        (book) => book.category === options.selectedCategory
      );
    }

    if (options.sortOption === 'priceAsc') {
      filteredBooks.sort((a, b) => a.price - b.price);
    } else if (options.sortOption === 'priceDesc') {
      filteredBooks.sort((a, b) => b.price - a.price);
    } else if (options.sortOption === 'rate') {
      filteredBooks.sort((a, b) => (b.rate || 0) - (a.rate || 0));
    }

    return filteredBooks;
  }
}
