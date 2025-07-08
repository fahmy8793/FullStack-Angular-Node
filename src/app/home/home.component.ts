// src/app/home/home.component.ts

import {
  AfterViewInit,
  Component,
  OnInit,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

// Services
import { BookService, PaginatedBookResponse } from '../services/book.service'; // Import the new response type
import { CartService } from '../services/cartService.service';
import { WishlistService } from '../services/wishlist.service';

// Interfaces
import { Book } from '../interfaces/book-details';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

// Other
import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger,
} from '@angular/animations';
import { CardbookComponent } from '../cardbook/cardbook.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    CardbookComponent,
    ButtonModule,
    ToastModule,
    DialogModule,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [MessageService],
  animations: [
    trigger('cardAnimation', [
      transition('* => *', [
        query(
          ':enter',
          [
            style({ opacity: 0, transform: 'translateY(20px)' }),
            stagger(100, [
              animate(
                '0.4s ease-out',
                style({ opacity: 1, transform: 'translateY(0)' })
              ),
            ]),
          ],
          { optional: true }
        ),
      ]),
    ]),
  ],
})
export class HomeComponent implements OnInit {
  bestSellerBooks: Book[] = [];
  featuredBooks: Book[] = [];

  showBookDetails = false;
  selectedBook: Book | null = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private bookService: BookService,
    private router: Router,
    private cartService: CartService,
    private wishlistService: WishlistService
  ) {}

  ngOnInit(): void {
    this.bookService.getAllBooks({ limit: 20 }).subscribe({
      next: (response: PaginatedBookResponse) => {
        const allBooks = response.data;

        // Sort all received books by rating
        const sortedByRating = [...allBooks].sort(
          (a, b) => (b.rate || 0) - (a.rate || 0)
        );

        // Assign to the different sections
        this.bestSellerBooks = sortedByRating.slice(0, 8);
        this.featuredBooks = sortedByRating.slice(0, 5);
      },
      error: (err) => {
        console.error('Failed to fetch books for homepage:', err);
      },
    });
  }

  goToShop(): void {
    this.router.navigate(['/shop']);
  }

  addToCart(book: Book): void {
    this.cartService.addItem({ bookId: book._id, quantity: 1 });
  }

  toggleWishlist(book: Book): void {
    this.wishlistService.toggleWishlist(book);
  }

  openBookDetails(book: Book): void {
    this.selectedBook = book;
    this.showBookDetails = true;
  }

  closeBookDetails(): void {
    this.showBookDetails = false;
    this.selectedBook = null;
  }

  getBookImagePath(book: Book): string {
    if (!book || !book.image) return 'assets/books_Imgs/default-book.png';
    if (book.image.startsWith('http')) return book.image;
    return `assets/books_Imgs/${book.image}`;
  }
}
