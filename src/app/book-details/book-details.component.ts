import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../services/book.service';
import { Book } from '../interfaces/book-details';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.scss'
})
export class BookDetailsComponent implements OnInit {
   bookData?: Book;

  constructor (private route:ActivatedRoute, private bookService:BookService ){}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id){
      this.bookService.getBookById(id).subscribe ( (book) => {
         console.log('book details:', book);
        this.bookData = book;
      });
    }

  }

}
