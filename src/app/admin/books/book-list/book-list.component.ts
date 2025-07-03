import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  stock: number;
}

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss']
})
export class BookListsComponent implements OnInit {
  books: Book[] = [];

  ngOnInit(): void {
    // Mock data
    this.books = [
      { id: 1, title: 'The Great Angular Adventure', author: 'Dev Master', price: 29.99, stock: 150 },
      { id: 2, title: 'Reacting to the Future', author: 'Code Wizard', price: 24.50, stock: 80 },
      { id: 3, title: 'Vue.js Simplicity', author: 'UI Guru', price: 19.99, stock: 200 },
      { id: 4, title: 'Node.js Backend Basics', author: 'Server Sage', price: 35.00, stock: 120 },
    ];
  }
}