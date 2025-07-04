import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Book } from '../interfaces/book-details';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  books: any[] = [];

  constructor(private http: HttpClient) {}

  getAllBooks(): Observable<Book[]> {
    return this.http.get<any>('https://fakerapi.it/api/v1/books').pipe(
      map((res) => {
        return (res.data || []).map((book: any, index: number) => ({
          id: book.id.toString(),
          title: book.title,
          author: book.author,
          description: book.description,
          image: book.image,
          category: book.genre,
          price: this.generatePrice(index),
          rate: this.generateRate(),
          inventoryStatus: this.generateInventoryStatus(),
        }));
      })
    );
  }
  private generatePrice(index: number): number {
    return 10 + (index % 5) * 5; // هيديك أسعار زي 10, 15, 20, 25, 30
  }

  private generateRate(): number {
    return +(Math.random() * 5).toFixed(1); // رقم عشري من 0 لـ 5
  }

  private generateInventoryStatus(): 'INSTOCK' | 'LOWSTOCK' | 'OUTOFSTOCK' {
    const statuses = ['INSTOCK', 'LOWSTOCK', 'OUTOFSTOCK'];
    return statuses[Math.floor(Math.random() * statuses.length)] as any;
  }

  getBookById(id: string): Observable<any> {
    return this.getAllBooks().pipe(
      map((books) => books.find((book) => book.id == id))
    );
  }
}

// private baseUrl = 'http://localhost:5000/api/books';

// getAllBooks(): Observable<any[]> {
//   return this.http.get<any[]>(this.baseUrl);
// }

// getBookById(id: string): Observable<any> {
//   return this.http.get<any>(`${this.baseUrl}/${id}`);
// }
