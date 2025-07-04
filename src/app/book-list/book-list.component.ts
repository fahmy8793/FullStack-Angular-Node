import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookService } from '../services/book.service';
import { CardbookComponent } from '../cardbook/cardbook.component';
import { Book } from '../interfaces/book-details';
import { CartService } from '../services/cartService.service';
import { WishlistService } from '../services/wishlist.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, CardbookComponent, ToastModule, DialogModule],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.scss',
  providers: [MessageService],
})
export class BookListComponent {
  books: Book[] = [];
  showBookDetails = false;
  selectedBook: Book | null = null;
  constructor(
    private bookService: BookService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.bookService.getAllBooks().subscribe((books) => {
      this.books = books;
    });
  }
  addToCart(book: Book) {
    const itemToAdd = {
      id: book.id,
      title: book.title,
      author: book.author,
      image: book.image,
      price: Number(book.price),
      quantity: 1,
    };
    this.cartService.addItem(itemToAdd);
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: `"${book.title}" added to your cart!`,
    });
  }

  addToWishlist(book: Book) {
    if (this.wishlistService.isInWishlist(book.id)) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Already Exists',
        detail: `"${book.title}" is already in your wishlist.`,
      });
    } else {
      this.wishlistService.addItem(book);
      this.messageService.add({
        severity: 'info',
        summary: 'Wishlist',
        detail: `"${book.title}" added to your wishlist!`,
      });
    }
  }
  openBookDetails(book: Book) {
    this.selectedBook = book;
    this.showBookDetails = true;
  }
  closeBookDetails() {
    this.showBookDetails = false;
    this.selectedBook = null;
  }
}
