// src/app/users/profile/profile.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // نحتاجه لـ ngModel في p-rating

// Services
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';

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
    FormsModule, // ✅ تم الإبقاء عليه
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [MessageService],
})
export class ProfileComponent implements OnInit {
  userOrders: Order[] = [];
  userName = ''; // متغير بسيط لتخزين اسم المستخدم

  // خصائص النافذة المنبثقة للتقييم
  ratingVisible = false;
  selectedOrder?: Order;
  selectedItem?: OrderItem;
  userRating = 0;

  constructor(
    private authService: AuthService,
    private orderService: OrderService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    // استمع لحالة المستخدم
    this.authService.currentUser$.subscribe((currentUser) => {
      if (currentUser) {
        // خزن الاسم واجلب الطلبات
        this.userName = currentUser.name;
        this.fetchUserOrders();
      }
    });
  }

  fetchUserOrders(): void {
    this.orderService.getMyOrders().subscribe({
      next: (orders) => {
        this.userOrders = orders;
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
    if (!this.selectedOrder || !this.selectedItem) return;

    const ratingPayload = {
      rating: this.userRating,
      orderId: this.selectedOrder._id,
      bookId: this.selectedItem.book._id,
    };

    this.orderService.rateBook(ratingPayload).subscribe({
      next: () => {
        if (this.selectedItem) {
          this.selectedItem.rating = this.userRating;
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
