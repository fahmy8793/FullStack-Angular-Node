// src/app/users/checkout/checkout.component.ts

import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cartService.service';
import { CartItem } from '../cart/cart.component';
import { AuthService } from '../../services/auth.service';
import { DialogModule } from 'primeng/dialog';
import { RatingModule } from 'primeng/rating';
import { HttpClient } from '@angular/common/http';

export interface OrderSummaryItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe, DialogModule, RatingModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent implements OnInit {
  orderSummaryItems: OrderSummaryItem[] = [];
  currentStep: number = 1;

  billingDetails = {
    // firstName: '',
    // lastName: '',
    name: '',
    email: '',
    phone: '',
    companyName: '',
    country: '',
    streetAddress: '',
    townCity: '',
    state: '',
    zipCode: '',
    shipToDifferentAddress: false,
    orderNotes: '',
    paymentMethod: 'COD',

    billingStreetAddress: '',
    billingTownCity: '',
    billingState: '',
    billingZipCode: '',
    billingCountry: '',

    cardNumber: '',
    expiryDate: '',
    cvv: '',

    codNotes: '',
  };

  constructor(
    private router: Router,
    private cartService: CartService,
    private authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe((cartItems) => {
      this.orderSummaryItems = cartItems.map((item) => ({
        id: item.id,
        name: item.title,
        price: item.price,
        quantity: item.quantity,
      }));
    });

    if (this.authService.isLoggedIn()) {
      const currentUser = this.authService.getCurrentUser();
      if (currentUser) {
        // this.billingDetails.firstName = currentUser.firstName || '';
        // this.billingDetails.lastName = currentUser.lastName || '';
        this.billingDetails.name = currentUser.name || '';
        this.billingDetails.email = currentUser.email || '';
        // this.billingDetails.phone = currentUser.phone || '';
      }
    }
  }

  getSubtotal(): number {
    return this.orderSummaryItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
  }

  getTotal(): number {
    return this.getSubtotal();
  }

  nextStep(): void {
    if (this.currentStep === 2) {
      if (this.billingDetails.paymentMethod === 'CreditCard') {
        if (
          !this.billingDetails.cardNumber ||
          !this.billingDetails.expiryDate ||
          !this.billingDetails.cvv
        ) {
          alert('Please enter all credit card details.');
          return;
        }
      }
    }

    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  placeOrder() {
    const orderData = {
      books: this.orderSummaryItems.map((item) => ({
        book: item.id,
        quantity: item.quantity,
      })),
      total: this.getTotal(),
    };

    this.http
      .post('http://localhost:3000/orders/checkout', orderData)
      .subscribe({
        next: (res) => {
          this.cartService.clearCart();
          this.router.navigate(['/profile']);
        },
        error: (err) => {
          console.error('Error placing order:', err);
        },
      });
  }
}
