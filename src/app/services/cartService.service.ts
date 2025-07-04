import { Injectable, PLATFORM_ID } from '@angular/core';
import { inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from '../users/cart/cart.component';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$: Observable<CartItem[]> = this.cartItemsSubject.asObservable();

  private platformId = inject(PLATFORM_ID);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const storedCart = localStorage.getItem('cartItems');
      if (storedCart) {
        this.cartItemsSubject.next(JSON.parse(storedCart));
      } else {
        this.cartItemsSubject.next([
          {
            id: '1',
            title: 'book One',
            author: 'Osama',
            image: 'assets/book1.webp',
            price: 15,
            quantity: 1,
          },
          {
            id: '2',
            title: 'book Two',
            author: 'Osama',
            image: 'assets/book2.webp',
            price: 20,
            quantity: 2,
          },
          {
            id: '3',
            title: 'book Three',
            author: 'Osama',
            image: 'assets/book3.webp',
            price: 30,
            quantity: 3,
          },
        ]);
      }
    } else {
      this.cartItemsSubject.next([]);
    }
  }

  private saveCart(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(
        'cartItems',
        JSON.stringify(this.cartItemsSubject.value)
      );
    }
  }

  getCartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  addItem(item: CartItem): void {
    const currentItems = this.cartItemsSubject.value;
    const existingItem = currentItems.find((i) => i.id === item.id);

    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      this.cartItemsSubject.next([...currentItems, item]);
    }
    this.saveCart();
  }

  removeItem(itemToRemove: CartItem): void {
    const updatedItems = this.cartItemsSubject.value.filter(
      (item) => item.id !== itemToRemove.id
    );
    this.cartItemsSubject.next(updatedItems);
    this.saveCart();
  }

  increaseQuantity(item: CartItem): void {
    const updatedItems = this.cartItemsSubject.value.map((i) =>
      i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
    );
    this.cartItemsSubject.next(updatedItems);
    this.saveCart();
  }

  decreaseQuantity(item: CartItem): void {
    const updatedItems = this.cartItemsSubject.value.map((i) => {
      if (i.id === item.id && i.quantity > 1) {
        return { ...i, quantity: i.quantity - 1 };
      }
      return i;
    });
    this.cartItemsSubject.next(updatedItems);
    this.saveCart();
  }

  clearCart(): void {
    this.cartItemsSubject.next([]);
    this.saveCart();
  }
}
