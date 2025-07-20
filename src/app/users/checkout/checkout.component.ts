// src/app/users/checkout/checkout.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cartService.service';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { CartItem } from '../../interfaces/book-details';
import { PaypalService } from '../../services/paypal.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  providers: [MessageService],
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  orderSummaryItems: any[] = [];
  currentStep = 1;
  stockWarning: string | null = null;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
    private paypalService: PaypalService,
    private toastr: ToastrService
  ) {
    this.checkoutForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9\s-]{10,}$/)]],
      streetAddress: ['', [Validators.required]],
      townCity: ['', [Validators.required]],
      zipCode: ['', [Validators.required]],
    });
  }

  get f() {
    return this.checkoutForm.controls;
  }

  ngOnInit(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('token');

    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      this.checkoutForm.patchValue({
        name: currentUser.name || '',
        email: currentUser.email || '',
      });
    }

    // 1. جلب بيانات الكارت
    this.cartService.cartItems$.subscribe((cartItems: CartItem[]) => {
      this.orderSummaryItems = cartItems.map((item) => ({
        bookId: item.book._id,
        name: item.book.title,
        price: item.book.price,
        quantity: item.quantity,
      }));

      // 2. لو جالي orderId من PayPal وكمان cart موجودة → نفذ الـ capture
      if (orderId && this.orderSummaryItems.length > 0) {
        this.captureOrder(orderId);
      }
    });
  }

  private captureOrder(orderID: string): void {
    const books = this.orderSummaryItems.map((item) => ({
      book: item.bookId,
      quantity: item.quantity,
    }));

    const total = this.getTotal();

    this.paypalService.captureOrder(orderID, books, total).subscribe({
      next: () => {
        this.cartService.clearCart();
        // this.cartService.fetchCart();
        this.toastr.success('Order placed successfully!', '', {
          timeOut: 3000,
          closeButton: true
        });

        setTimeout(() => {
          this.router.navigate(['/profile']);
        }, 3000);
      },
      error: (err) => {
        this.toastr.error(err.error.message || 'Failed to capture PayPal payment.');
      },
    });
  }

  nextStep(): void {
    if (this.currentStep === 1 && this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Incomplete',
        detail: 'Please fill all required fields.',
      });
      return;
    }
    if (this.currentStep < 3) this.currentStep++;
  }

  prevStep(): void {
    if (this.currentStep > 1) this.currentStep--;
  }

  getTotal(): number {
    return this.orderSummaryItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }

  placeOrder(): void {
    const cartSnapshot = this.cartService.getCartSnapshot();

    if (cartSnapshot.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Empty Cart',
        detail: 'Your cart is empty!',
      });
      return;
    }

    const books = cartSnapshot.map(item => ({
      book: item.book._id,
      quantity: item.quantity
    }));

    const total = cartSnapshot.reduce((sum, item) => sum + item.book.price * item.quantity, 0);

    this.paypalService.createOrder(total, books).subscribe({
      next: (res) => {
        if (res.stockError && res.issues?.length) {
          const msg = res.issues.map((i: { title: string; available: number; requested: number }) =>
            `"${i.title}": Only ${i.available} in stock, but you requested ${i.requested}`
          ).join('\n');

          this.stockWarning = msg;

          this.messageService.add({
            severity: 'warn',
            summary: 'Stock Issue',
            detail: msg,
            life: 7000
          });

          return;
        }

        this.stockWarning = null;
        localStorage.setItem('checkout_cart', JSON.stringify(cartSnapshot));
        window.location.href = res.approvalUrl;
      },
      error: (err) => {
        console.error('PayPal create order error:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'PayPal Error',
          detail: err.error?.message || 'Failed to create PayPal order.',
        });
      }
    });
  }
}
