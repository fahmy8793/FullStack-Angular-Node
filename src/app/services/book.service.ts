import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient , } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Book } from '../interfaces/book-details';

@Injectable({
  providedIn: 'root'
})
export class BookService {

books : any []=[];

  constructor(private http: HttpClient) { }

getAllBooks(): Observable<any[]> {
  return this.http.get<any>('https://fakerapi.it/api/v1/books')
    .pipe(
      map(res => res.data || [])
    );
}

  getBookById(id: string): Observable<any> {
    return this.getAllBooks()
    .pipe(
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
