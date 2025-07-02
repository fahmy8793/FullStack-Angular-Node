import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardbookComponent } from '../cardbook/cardbook.component';
import { Book } from '../interfaces/book-details';
import { BookService } from '../services/book.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardbookComponent,CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  booksData: Book[] = [];
  constructor(private bookService:BookService, private router:Router){}

  ngOnInit(): void {
  this.bookService.getAllBooks().subscribe((books) => {
    this.booksData = books.sort((a, b) => (b.rate || 0) - (a.rate || 0)).slice(0, 5);
  });
}

  goToShop(): void {
    this.router.navigate(['/shop']);
  }
}
