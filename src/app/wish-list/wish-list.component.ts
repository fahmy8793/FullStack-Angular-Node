// src/app/users/wish-list/wish-list.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WishlistService } from '../services/wishlist.service';
import { CartService } from '../services/cartService.service';
import { Book } from '../interfaces/book-details';
import { CardbookComponent } from '../cardbook/cardbook.component';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterModule, CardbookComponent],
  templateUrl: './wish-list.component.html',
  styleUrls: ['./wish-list.component.scss'],
})
export class WishlistComponent implements OnInit {
  // متغير لتخزين قائمة الأمنيات القادمة من الخدمة
  wishlist: Book[] = [];

  constructor(
    private wishlistService: WishlistService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    // اشترك في قائمة الأمنيات لعرضها
    this.wishlistService.wishlist$.subscribe((items: Book[]) => {
      this.wishlist = items;
    });
  }

  /**
   * دالة لإضافة كتاب من قائمة الأمنيات إلى السلة
   * @param book الكتاب الذي سيتم إضافته
   */
  addToCart(book: Book): void {
    // 1. أضف الكتاب إلى السلة
    this.cartService.addItem({ bookId: book._id, quantity: 1 });
    // 2. احذف الكتاب من قائمة الأمنيات
    this.wishlistService.toggleWishlist(book);
  }

  /**
   * دالة لحذف كتاب من قائمة الأمنيات عند الضغط على القلب
   * @param book الكتاب الذي سيتم حذفه
   */
  toggleWishlist(book: Book): void {
    // الخدمة ستقوم بكل المنطق
    this.wishlistService.toggleWishlist(book);
  }
}
