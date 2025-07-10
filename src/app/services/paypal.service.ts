import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PaypalService {
  private apiUrl = environment.apiUrl + '/paypal';
  constructor(private http: HttpClient) { }
  createOrder(total: number) {
    return this.http.post<any>(`${this.apiUrl}/create-order`, { total });
  }
  captureOrder(orderID: string, books: any[], total: number) {
    return this.http.post<any>(`${this.apiUrl}/capture-order`, {
      orderID, books, total
    });
  }
}
