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

@Component({
  selector: 'app-cardbook',
  standalone: true,
  imports: [CommonModule, ButtonModule, TagModule],
  templateUrl: './cardbook.component.html',
  styleUrls: ['./cardbook.component.scss'],
})
export class CardbookComponent implements OnInit, OnDestroy {
  @Input() bookData!: Book;
  @Output() addToCartEvent = new EventEmitter<Book>();
  @Output() addToWishlistEvent = new EventEmitter<Book>();
  @Output() showDetailsEvent = new EventEmitter<Book>();
  @Output() wishlistToggleEvent = new EventEmitter<Book>();

  isWishlisted = false;
  private wishlistSub!: Subscription;

  constructor(private wishlistService: WishlistService) {}

  ngOnInit(): void {
    this.wishlistSub = this.wishlistService.wishlist$.subscribe((items) => {
      this.isWishlisted = items.some((item) => item.id === this.bookData.id);
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
}
