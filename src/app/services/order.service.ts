import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Order } from '../interfaces/order-data.interface';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/order`;

  constructor(private http: HttpClient) {}

  placeOrder(orderData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/checkout`, orderData);
  }

  getMyOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/my-orders`);
  }
  rateBook(payload: {
    rating: number;
    bookId: string;
    orderId: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/review/${payload.bookId}`, {
      rating: payload.rating,
      comment: `Order ID: ${payload.orderId}`,
    });
  }
}
