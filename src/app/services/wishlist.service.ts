import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { Book } from '../interfaces/book-details';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private platformId = inject(PLATFORM_ID);
  private wishlistSubject = new BehaviorSubject<Book[]>([]);
  wishlist$: Observable<Book[]> = this.wishlistSubject.asObservable();

  constructor(private messageService: MessageService) {
    if (isPlatformBrowser(this.platformId)) {
      const storedWishlist = localStorage.getItem('wishlist');
      if (storedWishlist) {
        this.wishlistSubject.next(JSON.parse(storedWishlist));
      }
    }
  }

  private saveWishlist(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(
        'wishlist',
        JSON.stringify(this.wishlistSubject.value)
      );
    }
  }

  // --- دالة الإضافة التي تمنع التكرار ---
  addItem(book: Book): void {
    const currentItems = this.wishlistSubject.value;
    const isAlreadyAdded = currentItems.some((i) => i.id === book.id);

    if (isAlreadyAdded) {
      // إذا كان المنتج موجوداً، أظهر رسالة فقط
      this.messageService.add({
        severity: 'warn',
        summary: 'Already Exists',
        detail: `"${book.title}" is already in your wishlist.`,
      });
    } else {
      // إذا لم يكن موجوداً، قم بإضافته
      const updatedItems = [...currentItems, book];
      this.wishlistSubject.next(updatedItems);
      this.saveWishlist();
      this.messageService.add({
        severity: 'success',
        summary: 'Added',
        detail: `"${book.title}" added to your wishlist.`,
      });
    }
  }

  // --- دالة الحذف (للتoggling من المكون) ---
  removeItem(bookId: string): void {
    const updatedItems = this.wishlistSubject.value.filter(
      (i) => i.id !== bookId
    );
    this.wishlistSubject.next(updatedItems);
    this.saveWishlist();
  }
  public isInWishlist(bookId: string): boolean {
    return this.wishlistSubject.value.some((i) => i.id === bookId);
  }
}
