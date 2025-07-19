import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Book } from '../interfaces/book-details';
import { environment } from '../../environments/environment';

export interface BookQueryOptions {
  page?: number;
  limit?: number;
  category?: string;
  sort?: 'rating' | 'priceAsc' | 'priceDesc' | '';
  author?: string;
  searchQuery?: string;
}

export interface PaginatedBookResponse {
  message: string;
  data: Book[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private apiUrl = `${environment.apiUrl}/book`;

  constructor(private http: HttpClient) {}

  getAllBooks(
    options: BookQueryOptions = {}
  ): Observable<PaginatedBookResponse> {
    let params = new HttpParams();

    if (options.page) {
      params = params.append('page', options.page.toString());
    }
    if (options.limit) {
      params = params.append('limit', options.limit.toString());
    }
    if (options.category) {
      params = params.append('category', options.category);
    }
    if (options.sort) {
      params = params.append('sort', options.sort);
    }
    if (options.searchQuery) {
      params = params.append('searchQuery', options.searchQuery);
    }
    return this.http.get<PaginatedBookResponse>(this.apiUrl, { params });
  }

  getBookById(id: string): Observable<Book> {
    return this.http
      .get<any>(`${this.apiUrl}/${id}`)
      .pipe(map((response) => response.data));
  }
  submitReview(
    bookId: string,
    rating: number,
    comment: string
  ): Observable<any> {
    const reviewData = { rating, comment };
    return this.http.post(`${this.apiUrl}/${bookId}/reviews`, reviewData);
  }
}
