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

  // NEW METHOD: Get all orders (for admin dashboard)
  getAllOrders(): Observable<Order[]> {
    return this.http.get<{ data: Order[] }>(`${this.apiUrl}/admin`, {
      headers: this.getHeaders()
    }).pipe(
      map(res => res.data),
      catchError(error => {
        console.error('Error fetching all orders:', error);
        return throwError(() => error);
      })
    );
  }

  // Optional: Get orders with pagination and filters
  getOrdersWithPagination(page: number = 1, limit: number = 10, filters?: any): Observable<{ data: Order[], total: number }> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params = params.set(key, filters[key]);
        }
      });
    }

    return this.http.get<{ data: Order[], total: number }>(`${this.apiUrl}/admin`, {
      headers: this.getHeaders(),
      params
    }).pipe(
      catchError(error => {
        console.error('Error fetching paginated orders:', error);
        return throwError(() => error);
      })
    );
  }
}