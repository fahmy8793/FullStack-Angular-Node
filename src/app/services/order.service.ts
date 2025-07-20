import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Order } from '../interfaces/order-data.interface';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/order`;

constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  placeOrder(orderData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/checkout`, orderData);
  }

  getMyOrders(): Observable<Order[]> {
    return this.http.get<{ data: Order[] }>(`${this.apiUrl}/my-orders`).pipe(
      map(res => res.data)
    );
  }
   // Get order details
  getOrderById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  rateBook(payload: {
    rating: number;
    bookId: string;
    orderId: string;
  }): Observable<any> {
    const reviewUrl = `http://localhost:5000/api/book/${payload.bookId}/reviews`;
    return this.http.post(reviewUrl, {
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
