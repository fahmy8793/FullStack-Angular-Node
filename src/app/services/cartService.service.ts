import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { CartItem } from '../interfaces/book-details';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItemsSource = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSource.asObservable();

  private apiUrl = `${environment.apiUrl}/cart`;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.loadInitialCart();
      } else {
        this.cartItemsSource.next([]);
      }
    });
  }

  private loadInitialCart() {
    this.http.get<{ data: CartItem[] }>(this.apiUrl).subscribe((response) => {
      this.cartItemsSource.next(response.data || []);
    });
  }

  addItem(item: { bookId: string; quantity: number }): void {
    this.http
      .post<{ data: CartItem[] }>(`${this.apiUrl}/add`, item)
      .pipe(tap((response) => this.cartItemsSource.next(response.data)))
      .subscribe();
  }

  removeItem(bookId: string): void {
    this.http.delete<void>(`${this.apiUrl}/remove/${bookId}`).subscribe(() => {
      const updatedCart = this.cartItemsSource
        .getValue()
        .filter((item) => item.book._id !== bookId);
      this.cartItemsSource.next(updatedCart);
    });
  }

  increaseQuantity(item: CartItem): void {
    const newQuantity = item.quantity + 1;
    this.updateQuantity(item.book._id, newQuantity);
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      const newQuantity = item.quantity - 1;
      this.updateQuantity(item.book._id, newQuantity);
    }
  }

  private updateQuantity(bookId: string, quantity: number): void {
    this.http
      .put<{ data: CartItem[] }>(`${this.apiUrl}/update`, { bookId, quantity })
      .pipe(tap((response) => this.cartItemsSource.next(response.data)))
      .subscribe();
  }

  clearCart(): void {
    this.cartItemsSource.next([]);
  }
}
