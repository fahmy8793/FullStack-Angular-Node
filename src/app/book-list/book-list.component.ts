import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Services
import {
  BookService,
  BookQueryOptions,
  PaginatedBookResponse,
} from '../services/book.service';
import { CartService } from '../services/cartService.service';
import { WishlistService } from '../services/wishlist.service';

// Interfaces
import { Book } from '../interfaces/book-details';

// PrimeNG Modules
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';

import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

// Components
import { CardbookComponent } from '../cardbook/cardbook.component';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    CardbookComponent,
    PaginatorModule,
    ToastModule,
    DialogModule,
  ],
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss'],
  providers: [MessageService],
})
export class BookListComponent implements OnInit, OnDestroy {
  books: Book[] = [];
  categories: string[] = [];
  summary: string = '';
  isLoadingSummary = false;

  // Pagination Properties
  totalRecords = 0;
  rows = 12; // Number of books per page

  // Filter Properties
  searchQuery = '';
  selectedCategory = '';
  sortOption: 'rating' | 'priceAsc' | 'priceDesc' | '' = 'rating';

  // Details Popup Properties
  showBookDetails = false;
  selectedBook: Book | null = null;

  private searchSubject = new Subject<string>();
  private searchSubscription!: Subscription;

  constructor(
    private bookService: BookService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.fetchBooks(1); // Fetch the first page on component load
    this.loadCategories(); // Load categories for the filter dropdown
    this.searchSubscription = this.searchSubject
      .pipe(debounceTime(200), distinctUntilChanged()) // wait 200 m.secodnd after press chars on search input
      .subscribe(() => {
        this.onFilterChange();
      });
  }
  getBookImagePath(book: Book): string {
    if (!book || !book.image) {
      //default photo if not found photo
      return 'assets/books_Imgs/book1.jpg';
    }
    if (book.image.startsWith('http')) {
      return book.image;
    }
    return `assets/books_Imgs/${book.image}`;
  }
  ngOnDestroy(): void {
    this.searchSubscription.unsubscribe();
  }

  onCategorySelect(category: string): void {
    this.selectedCategory = category;
    this.onFilterChange(); // نستدعي نفس الدالة ليعاد تحميل الكتب بالفئة الجديدة
  }

  fetchBooks(page: number): void {
    const options: BookQueryOptions = {
      page: page,
      limit: this.rows,
      category: this.selectedCategory || undefined,
      sort: this.sortOption || undefined,
      searchQuery: this.searchQuery || undefined,
    };

    this.bookService
      .getAllBooks(options)
      .subscribe((response: PaginatedBookResponse) => {
        this.books = response.data;
        this.totalRecords = response.pagination.total;
      });
  }
  onSearchInput(): void {
    this.searchSubject.next(this.searchQuery);
  }

  loadCategories(): void {
    this.bookService.getAllBooks({ limit: 100 }).subscribe((response) => {
      const allCategories = response.data.map((book) => book.category);
      // Filter out null/undefined and get unique values
      this.categories = [...new Set(allCategories.filter((cat) => cat))];
    });
  }

  onPageChange(event: PaginatorState): void {
    const newPage = (event.page ?? 0) + 1;
    this.rows = event.rows ?? 12;
    this.fetchBooks(newPage);
  }

  onFilterChange(): void {
    this.fetchBooks(1);
  }

  addToCart(book: Book): void {
    const isInCart = this.cartService.isInCart(book._id);
    if (isInCart) {
      this.cartService.removeItem(book._id);
      this.messageService.add({
        severity: 'warn',
        summary: 'Removed',
        detail: `"${book.title}" removed from your cart.`,
      });
    } else {
      this.cartService.addItem({ bookId: book._id, quantity: 1 });
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: `"${book.title}" added to your cart!`,
      });
    }
  }

  toggleWishlist(book: Book): void {
    this.wishlistService.toggleWishlist(book);
  }

  openBookDetails(book: Book): void {
    this.selectedBook = book;
     this.summary = '';
  this.isLoadingSummary = false;


    this.showBookDetails = true;
  }

  closeBookDetails(): void {
    this.showBookDetails = false;
    this.selectedBook = null;
  }

  generateSummary(bookId: string) {
    if (this.isLoadingSummary) return;
    
  this.summary = '';
  this.isLoadingSummary = true;

  // brevent multiple clicks while loading
  this.isLoadingSummary = true;

  this.bookService.generateSummary(bookId).subscribe({
    next: (res) => {
      this.summary = res.summary;
      this.isLoadingSummary = false;
    },
    error: (err) => {
      console.error('Error fetching summary:', err);
      //this.summary = 'Failed to load summary.';
      this.isLoadingSummary = false;

  if (err.status === 401) {
    this.summary = 'you need to login to generate summary.';
  } else if (err.status === 429) {
    this.summary = 'there is too many reqests, please wait';
  } else {
    this.summary = 'Failed to load summary.';
  }
    }
  });
}

}
