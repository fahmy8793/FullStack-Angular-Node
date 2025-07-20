// src/app/users/profile/profile.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

// Services
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { BookService } from '../../services/book.service';
import { UserService } from '../../services/user.service';

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

  // خصائص نماذج تحديث البيانات
  updateNameData = { name: '' };
  updatePasswordData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  // خصائص نافذة التقييم
  ratingVisible = false;
  selectedOrder?: Order;
  selectedItem?: OrderItem;
  userRating = 0;

  constructor(
    private authService: AuthService,
    private orderService: OrderService,
    private messageService: MessageService,
    private bookService: BookService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((currentUser) => {
      if (currentUser) {
        this.userName = currentUser.name;
        this.updateNameData.name = currentUser.name; // لملء حقل الاسم بالاسم الحالي
        this.fetchUserOrders();
      }
    });
  }

  fetchUserOrders(): void {
    this.orderService.getMyOrders().subscribe({
      next: (res) => {
        this.userOrders = res;
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
      return;
    }

    if (!this.selectedItem) return;

    const bookId = this.selectedItem.book._id;
    const rating = this.userRating;
    const comment = ''; // يمكنك إضافة حقل للتعليق في المستقبل

    this.bookService.submitReview(bookId, rating, comment).subscribe({
      next: () => {
        if (this.selectedItem) {
          this.selectedItem.isReviewed = true; // تحديث الواجهة فورًا
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

  updateName(): void {
    this.userService.updateProfile(this.updateNameData).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Your name has been updated!',
        });
        // تحديث الاسم في كل مكان في الموقع
        this.authService.updateUserName(response.name);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error.message || 'Failed to update name.',
        });
      },
    });
  }

  changePassword(): void {
    if (
      this.updatePasswordData.newPassword !==
      this.updatePasswordData.confirmPassword
    ) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Passwords Do Not Match',
        detail: 'Please ensure the new passwords match.',
      });
      return;
    }

    this.userService
      .updatePassword({
        oldPassword: this.updatePasswordData.currentPassword,
        newPassword: this.updatePasswordData.newPassword,
      })
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Your password has been changed successfully.',
          });
          // تفريغ الحقول للأمان
          this.updatePasswordData = {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
          };
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error.message || 'Failed to change password.',
          });
        },
      });
  }
}
