import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { Book } from '../interfaces/book-details';
import { WishlistService } from './../services/wishlist.service';
import { Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';
import { CartService } from '../services/cartService.service';

@Component({
  selector: 'app-cardbook',
  standalone: true,
  imports: [CommonModule, ButtonModule, TagModule],
  templateUrl: './cardbook.component.html',
  styleUrls: ['./cardbook.component.scss'],
})
export class CardbookComponent implements OnInit, OnDestroy {
  @Input() bookData!: Book;
  @Input() isInCart: boolean = false;
  @Output() removeFromCartEvent = new EventEmitter<Book>();
  @Output() addToCartEvent = new EventEmitter<Book>();
  @Output() addToWishlistEvent = new EventEmitter<Book>();
  @Output() showDetailsEvent = new EventEmitter<Book>();
  @Output() wishlistToggleEvent = new EventEmitter<Book>();

  isWishlisted = false;
  private wishlistSub!: Subscription;

  constructor(
    private wishlistService: WishlistService,
    private messageService: MessageService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.wishlistSub = this.wishlistService.wishlist$.subscribe((items) => {
      this.isWishlisted = items.some((item) => item._id === this.bookData._id);
    });
  }

  ngOnDestroy(): void {
    if (this.wishlistSub) {
      this.wishlistSub.unsubscribe();
    }
  }

  onAddToCart() {
    this.addToCartEvent.emit(this.bookData);
  }

  onWishlistToggle() {
    this.wishlistToggleEvent.emit(this.bookData);
    this.addToWishlistEvent.emit(this.bookData);
  }

  onShowDetails() {
    this.showDetailsEvent.emit(this.bookData);
  }

  getBookImagePath(): string {
    const img = this.bookData.image;
    if (img?.startsWith('http')) {
      return img;
    }
    return `../../assets/books_Imgs/${img}`;
  }
  getSeverity(book: Book): string {
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

  toggleCart() {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (this.isInCart) {
      cart = cart.filter((item: any) => item.id !== this.bookData._id);
      this.messageService.add({
        severity: 'warn',
        summary: 'Removed',
        detail: `${this.bookData.title} removed from cart`,
      });
    } else {
      cart.push(this.bookData);
      this.cartService.addItem({
        bookId: this.bookData._id,
        quantity: 1,
      });
      this.messageService.add({
        severity: 'success',
        summary: 'Added',
        detail: `${this.bookData.title} added to cart`,
      });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    this.isInCart = !this.isInCart;
  }
}
