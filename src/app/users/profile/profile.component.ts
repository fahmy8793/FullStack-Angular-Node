import { Component, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserData } from '../../interfaces/user-data';
import { OrderService } from '../../services/order.service';
import { Order } from '../../interfaces/order-data.interface';
import { DialogModule } from 'primeng/dialog';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    DialogModule,
    RatingModule,
    FormsModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  userOrders: Order[] = [];
  userName: string = '';

  ratingVisible = false;
  selectedOrderId = '';
  selectedBookId = '';
  userRating = 0;

  constructor(
    private authService: AuthService,
    private router: Router,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      const currentUser: UserData | null = this.authService.getCurrentUser();
      if (currentUser) {
        this.userName = currentUser.name || '';
        this.orderService.getMyOrders().subscribe({
          next: (orders) => {
            this.userOrders = orders;
          },
          error: (err) => {
            console.error('Failed to load user orders:', err);
          },
        });
      } else {
        this.router.navigate(['/login']);
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  openRatingDialog(orderId: string, bookId: string) {
    this.selectedOrderId = orderId;
    this.selectedBookId = bookId;
    this.userRating = 0;
    this.ratingVisible = true;
  }

  submitRating() {
    const ratingPayload = {
      rating: this.userRating,
      orderId: this.selectedOrderId,
      bookId: this.selectedBookId,
    };

    this.orderService.rateBook(ratingPayload).subscribe({
      next: () => {
        const order = this.userOrders.find(
          (o) => o._id === this.selectedOrderId
        );
        const item = order?.items.find(
          (i) => i.productId === this.selectedBookId
        );

        this.ratingVisible = false;
        alert('Thanks for your rating!');
      },
      error: (err) => {
        console.error('Error submitting rating:', err);
        alert('Failed to submit rating.');
      },
    });
  }
}
