import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Order } from '../interfaces/order-data.interface';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/order`;

  constructor(private http: HttpClient) { }

  placeOrder(orderData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/checkout`, orderData);
  }

  getMyOrders(): Observable<Order[]> {
    return this.http.get<{ data: Order[] }>(`${this.apiUrl}/my-orders`).pipe(
      map(res => res.data)
    );
  }

  rateBook(payload: {
    rating: number;
    bookId: string;
    orderId: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/${payload.bookId}/reviews`, {
      rating: payload.rating,
      comment: `Order ID: ${payload.orderId}`,
    });
    return this.http.post(`${this.apiUrl}/${payload.bookId}/reviews`, {
      rating: payload.rating,
      comment: `Order ID: ${payload.orderId}`,
    }).pipe(
      catchError(error => {
        console.error('Error submitting rating:', error);
        return throwError(() => error);
      })
    );
  }
}
