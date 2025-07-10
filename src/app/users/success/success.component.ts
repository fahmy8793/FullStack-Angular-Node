import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaypalService } from '../../services/paypal.service';
import { CartService } from '../../services/cartService.service';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-success',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss'],
  providers: [MessageService],
})
export class SuccessComponent implements OnInit {
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private paypalService: PaypalService,
    private cartService: CartService,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    const orderID = this.route.snapshot.queryParamMap.get('token');

    if (!orderID) {
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid Payment',
        detail: 'Order ID is missing.',
      });
      this.loading = false;
      return;
    }

    const savedCart = localStorage.getItem('checkout_cart');
    const cart: { book: { _id: string; price: number }; quantity: number }[] = savedCart ? JSON.parse(savedCart) : [];
    localStorage.removeItem('checkout_cart');

    if (!cart.length) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Empty Cart',
        detail: 'No items found in cart for this order.',
      });
      this.loading = false;
      return;
    }

    const books = cart.map((item: { book: { _id: string }; quantity: number }) => ({
      book: item.book._id,
      quantity: item.quantity,
    }));
    const total = cart.reduce((sum, item) => sum + item.book.price * item.quantity, 0);

    this.paypalService.captureOrder(orderID, books, total).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Order Completed',
          detail: 'Your payment was successful!',
        });
        this.cartService.clearCart();
        this.loading = false;
        setTimeout(() => this.router.navigate(['/profile']), 3000);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Capture Failed',
          detail: err.error.message || 'Something went wrong.',
        });
        this.loading = false;
      },
    });
  }
}
