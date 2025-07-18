// src/app/users/profile/profile.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // نحتاجه لـ ngModel في p-rating

// Services
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { BookService } from '../../services/book.service';

// Interfaces
import { Order, OrderItem } from '../../interfaces/order-data.interface';

// PrimeNG
import { DialogModule } from 'primeng/dialog';
import { RatingModule } from 'primeng/rating';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DialogModule,
    RatingModule,
    FormsModule,
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [MessageService],
})
export class ProfileComponent implements OnInit {
  userOrders: Order[] = [];
  userName = '';

  ratingVisible = false;
  selectedOrder?: Order;
  selectedItem?: OrderItem;
  userRating = 0;

  constructor(
    private authService: AuthService,
    private orderService: OrderService,
    private messageService: MessageService,
    private bookService: BookService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((currentUser) => {
      if (currentUser) {
        this.userName = currentUser.name;
        this.fetchUserOrders();
      }
    });
  }

  fetchUserOrders(): void {
    this.orderService.getMyOrders().subscribe({
      next: (res) => {
        this.userOrders = res.map((order) => {
          return {
            ...order,
            books: order.books || [],
          };
        });
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load your orders.',
        });
      },
    });
  }

  openRatingDialog(order: Order, item: OrderItem): void {
    this.selectedOrder = order;
    this.selectedItem = item;
    this.userRating = 0;
    this.ratingVisible = true;
  }

  submitRating(): void {
    if (this.userRating === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Invalid Rating',
        detail: 'Please select at least one star.',
      });
      return; // This will stop the function from continuing
    }

    // We only need the selectedItem, which contains the book ID
    if (!this.selectedItem) return;

    const bookId = this.selectedItem.book._id;
    const rating = this.userRating;
    const comment = ''; // Add a comment if you have a field for it

    // Call the correct function from BookService
    this.bookService.submitReview(bookId, rating, comment).subscribe({
      next: () => {
        // Update the UI immediately
        if (this.selectedItem) {
          this.selectedItem.rating = this.userRating;
          this.selectedItem.isReviewed = true; // Mark as reviewed
        }
        this.ratingVisible = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Thank you for your rating!',
        });
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error.message || 'Failed to submit rating.',
        });
      },
    });
  }
}
