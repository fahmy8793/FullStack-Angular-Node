import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // For ngModel

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.scss']
})
export class BookDetailComponent implements OnInit {
  bookId: string | null = null;
  book: any = {
    title: '',
    author: '',
    price: null,
    stock: null,
    description: ''
  };
  isNewBook = true;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.bookId = params.get('id');
      if (this.bookId) {
        this.isNewBook = false;
        // In a real app, fetch book details by ID
        console.log('Fetching book with ID:', this.bookId);
        // Mock data for editing
        this.book = {
          id: this.bookId,
          title: 'Existing Book Title ' + this.bookId,
          author: 'Existing Author',
          price: 25.99,
          stock: 50,
          description: 'This is a description for an existing book.'
        };
      } else {
        this.isNewBook = true;
      }
    });
  }

  saveBook(): void {
    if (this.isNewBook) {
      console.log('Adding new book:', this.book);
      // Call service to add book
    } else {
      console.log('Updating book:', this.book);
      // Call service to update book
    }
    this.router.navigate(['../'], { relativeTo: this.route }); // Navigate back to list
  }

  cancel(): void {
    this.router.navigate(['../'], { relativeTo: this.route }); // Navigate back to list
  }
}