import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookService } from '../services/book.service';
import { CardbookComponent } from '../cardbook/cardbook.component';
import { Book } from '../interfaces/book-details';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, CardbookComponent],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.scss'
})
export class BookListComponent {
  books : Book []=[];

  constructor (private bookService:BookService){}

  ngOnInit(): void{
    this.bookService.getAllBooks().subscribe((books) => {
      this.books = books;
    });
  }
}
