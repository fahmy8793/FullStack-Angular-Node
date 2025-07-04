// src/app/services/order.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../interfaces/order-data.interface';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = 'http://localhost:3000/api/orders';

  constructor(private http: HttpClient) {}

  getMyOrders(): Observable<Order[]> {
    const token = localStorage.getItem('authToken');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', 'Bearer ' + token);
    }

    return this.http.get<Order[]>(`${this.apiUrl}/my-orders`, { headers });
  }
  rateBook(data: { rating: number; bookId: string; orderId: string }) {
    return this.http.post(
      `http://localhost:3000/books/${data.bookId}/reviews`,
      {
        rating: data.rating,
        orderId: data.orderId,
      }
    );
  }

  // getOrderById(orderId: string): Observable<Order> { ... }
  // cancelOrder(orderId: string): Observable<any> { ... }
}
