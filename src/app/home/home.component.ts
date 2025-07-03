import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardbookComponent } from '../cardbook/cardbook.component';
import { Book } from '../interfaces/book-details';
import { BookService } from '../services/book.service';
import { Router } from '@angular/router';

import Splide from '@splidejs/splide';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardbookComponent,CommonModule ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  booksData: Book[] = [];
  constructor(private bookService:BookService, private router:Router){}

  ngOnInit(): void {
  this.bookService.getAllBooks().subscribe((books) => {
    this.booksData = books.sort((a, b) => (b.rate || 0) - (a.rate || 0)).slice(0, 5);
      setTimeout(() => {
      new Splide('#book-slider', {
      type: 'loop',
      perPage: 4,
      gap: '1rem',
      autoplay: true,
      interval: 3000,
      pauseOnHover: true,
      pauseOnFocus: true, 
      breakpoints: {
        768: { perPage: 2 },
        480: { perPage: 1 },
      },
    }).mount();
   });
  });
}

  goToShop(): void {
    this.router.navigate(['/shop']);
  }



}
