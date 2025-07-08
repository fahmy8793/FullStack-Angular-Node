import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { Book } from '../interfaces/book-details';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private wishlistSubject = new BehaviorSubject<Book[]>([]);
  wishlist$ = this.wishlistSubject.asObservable();

  private apiUrl = `${environment.apiUrl}/wishlist`;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private messageService: MessageService
  ) {
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.loadInitialWishlist();
      } else {
        this.wishlistSubject.next([]);
      }
    });
  }


  private loadInitialWishlist() {
    this.http.get<{ data: Book[] }>(this.apiUrl).subscribe((response) => {
      this.wishlistSubject.next(response.data || []);
    });
  }


  toggleWishlist(book: Book): void {
    const isAlreadyAdded = this.wishlistSubject
      .getValue()
      .some((item) => item._id === book._id);

    if (isAlreadyAdded) {
      this.http.delete<void>(`${this.apiUrl}/remove/${book._id}`).subscribe({
        next: () => {
          const updatedList = this.wishlistSubject
            .getValue()
            .filter((item) => item._id !== book._id);
          this.wishlistSubject.next(updatedList);
          this.messageService.add({
            severity: 'info',
            summary: 'Removed',
            detail: `"${book.title}" removed from wishlist.`,
          });
        },
        error: (err) => console.error('Failed to remove from wishlist', err),
      });
    } else {
      this.http
        .post<any>(`${this.apiUrl}/add`, { bookId: book._id })
        .subscribe({
          next: (response) => {

            const updatedList = [...this.wishlistSubject.getValue(), book];
            this.wishlistSubject.next(updatedList);
            this.messageService.add({
              severity: 'success',
              summary: 'Added',
              detail: `"${book.title}" added to wishlist.`,
            });
          },
          error: (err) => {
            this.messageService.add({
              severity: 'warn',
              summary: 'Could not add',
              detail: err.error.message || 'Already in wishlist.',
            });
          },
        });
    }
  }
}
