import { WishlistService } from './../services/wishlist.service';
import { CartService } from './../services/cartService.service';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardbookComponent } from '../cardbook/cardbook.component';
import { Book } from '../interfaces/book-details';
import { DataViewModule } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { BookService } from '../services/book.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import Splide from '@splidejs/splide';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CardbookComponent,
    CommonModule,
    ButtonModule,
    TagModule,
    DataViewModule,
    ToastModule,
    DialogModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  providers: [MessageService],
})
export class HomeComponent implements OnInit, AfterViewInit {
  booksData: Book[] = [];
  splideSlider: Splide | null = null;

  // Popup book details
  showBookDetails = false;
  selectedBook: Book | null = null;

  constructor(
    private bookService: BookService,
    private router: Router,
    private CartService: CartService,
    private wishlistService: WishlistService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.bookService.getAllBooks().subscribe((books) => {
      this.booksData = books
        .sort((a, b) => (b.rate || 0) - (a.rate || 0))
        .slice(0, 8);
      this.initSlider();
    });
  }

  ngAfterViewInit(): void {
    this.initSlider();
  }

  initSlider() {
    if (
      document.querySelector('#book-slider') &&
      this.booksData.length > 0 &&
      !this.splideSlider
    ) {
      this.splideSlider = new Splide('#book-slider', {
        type: 'loop',
        perPage: 4,
        gap: '1rem',
        autoplay: true,
        interval: 3000,
        pauseOnHover: true,
        breakpoints: {
          992: { perPage: 3 },
          768: { perPage: 2 },
          480: { perPage: 1 },
        },
      }).mount();
    }
  }

  goToShop(): void {
    this.router.navigate(['/shop']);
  }

  getSeverity(book: Book) {
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

  addToCart(book: Book) {
    const itemToAdd = {
      id: book.id,
      title: book.title,
      author: book.author,
      image: book.image,
      price: Number(book.price),
      quantity: 1,
    };
    this.CartService.addItem(itemToAdd);
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: `"${book.title}" added to your cart!`,
    });
  }

  addToWishlist(book: Book) {
    const isAlreadyAdded = this.wishlistService.isInWishlist(book.id);
    if (isAlreadyAdded) {
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

  // Popup book details
  openBookDetails(book: Book) {
    this.selectedBook = book;
    this.showBookDetails = true;
  }
  closeBookDetails() {
    this.showBookDetails = false;
    this.selectedBook = null;
  }
}
