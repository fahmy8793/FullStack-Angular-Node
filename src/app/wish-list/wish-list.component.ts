import { Component, OnInit } from '@angular/core';
import { WishlistService } from '../services/wishlist.service';
import { Book } from '../interfaces/book-details';
import { CartService } from '../services/cartService.service';
import { CardbookComponent } from '../cardbook/cardbook.component';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-wishlist',
  templateUrl: 'wish-list.component.html',
  styleUrl: './wish-list.component.scss',
  standalone: true,
  imports: [CardbookComponent, CommonModule],
  providers: [MessageService],
})
export class WishlistComponent implements OnInit {
  wishlist: Book[] = [];

  constructor(
    private wishlistService: WishlistService,
    private cartService: CartService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.wishlistService.wishlist$.subscribe((items: Book[]) => {
      this.wishlist = items;
    });
  }

  removeFromWishlist(book: Book) {
    this.wishlistService.removeItem(book.id);
  }
  addToCart(book: Book) {
    this.cartService.addItem({
      id: book.id,
      title: book.title,
      author: book.author,
      image: book.image,
      price: Number(book.price),
      quantity: 1,
    });
    this.removeFromWishlist(book);
    this.messageService.add({
      severity: 'success',
      summary: 'Cart',
      detail: `"${book.title}" added to cart!`,
    });
  }

  toggleWishlist(book: Book) {
    this.wishlistService.removeItem(book.id);
    this.messageService.add({
      severity: 'info',
      summary: 'Wishlist',
      detail: `"${book.title}" removed from your wishlist!`,
    });
  }
}
