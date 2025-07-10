// // src/app/users/checkout/checkout.component.ts

// import { CommonModule } from '@angular/common';
// import { Component, OnInit } from '@angular/core';
// // ✅ Step 1: Import everything needed for Reactive Forms
// import {
//   ReactiveFormsModule,
//   FormBuilder,
//   FormGroup,
//   Validators,
// } from '@angular/forms';
// import { Router } from '@angular/router';

// // Services
// import { CartService } from '../../services/cartService.service';
// import { AuthService } from '../../services/auth.service';
// import { OrderService } from '../../services/order.service';

// // Interfaces
// import { CartItem } from '../../interfaces/book-details';

// // PrimeNG
// import { MessageService } from 'primeng/api';
// // paypal service
// import { PaypalService } from '../../services/paypal.service';

// // This interface is for displaying the summary, it's good to keep
// // export interface OrderSummaryItem {
// //   bookId: string;
// //   name: string;
// //   price: number;
// //   quantity: number;
// // }

// @Component({
//   selector: 'app-checkout',
//   standalone: true,
//   // ✅ Step 2: Add ReactiveFormsModule to your imports
//   imports: [CommonModule, ReactiveFormsModule],
//   templateUrl: './checkout.component.html',
//   styleUrls: ['./checkout.component.scss'],
//   providers: [MessageService],
// })
// export class CheckoutComponent implements OnInit {
//   orderSummaryItems: OrderSummaryItem[] = [];
//   currentStep: number = 1;

//   // ✅ Step 3: Define the FormGroup property
//   checkoutForm: FormGroup;

//   constructor(
//     private router: Router,
//     private cartService: CartService,
//     private authService: AuthService,
//     private orderService: OrderService,
//     private messageService: MessageService,
//     private fb: FormBuilder // ✅ Step 4: Inject the FormBuilder
//   ) {
//     this.checkoutForm = this.fb.group({
//       name: ['', [Validators.required]],
//       email: ['', [Validators.required, Validators.email]],
//       phone: [
//         '',
//         [Validators.required, Validators.pattern(/^\+?[0-9\s-]{10,}$/)],
//       ],
//       streetAddress: ['', [Validators.required]],
//       townCity: ['', [Validators.required]],
//       zipCode: ['', [Validators.required]],
//       paymentMethod: ['COD', [Validators.required]],
//     });
//   }
//   get f() {
//     return this.checkoutForm.controls;
//   }

//   ngOnInit(): void {
//     // ... (منطق ngOnInit يبقى كما هو)
//     this.cartService.cartItems$.subscribe((cartItems: CartItem[]) => {
//       this.orderSummaryItems = cartItems.map((item) => ({
//         bookId: item.book._id,
//         name: item.book.title,
//         price: item.book.price,
//         quantity: item.quantity,
//       }));
//     });

//     const currentUser = this.authService.currentUserValue;
//     if (currentUser) {
//       this.checkoutForm.patchValue({
//         name: currentUser.name || '',
//         email: currentUser.email || '',
//       });
//     }
//   }

//   // --- Step Navigation ---
//   nextStep(): void {
//     // You can add validation checks here before moving to the next step
//     if (this.currentStep === 1 && this.checkoutForm.invalid) {
//       this.checkoutForm.markAllAsTouched(); // Show errors if form is not valid
//       this.messageService.add({
//         severity: 'warn',
//         summary: 'Incomplete',
//         detail: 'Please fill all required fields.',
//       });
//       return;
//     }
//     if (this.currentStep < 3) {
//       this.currentStep++;
//     }
//   }

//   prevStep(): void {
//     if (this.currentStep > 1) {
//       this.currentStep--;
//     }
//   }

//   // --- Total Calculation ---
//   getSubtotal(): number {
//     return this.orderSummaryItems.reduce(
//       (acc, item) => acc + item.price * item.quantity,
//       0
//     );
//   }

//   getTotal(): number {
//     return this.getSubtotal();
//   }

//   // --- Place Order Logic ---
//   placeOrder() {
//     if (this.checkoutForm.invalid) {
//       this.messageService.add({
//         severity: 'error',
//         summary: 'Error',
//         detail: 'The form is not complete.',
//       });
//       return;
//     }

//     // ✅ Step 7: Get data from the reactive form value
//     const formValue = this.checkoutForm.value;

//     const orderData = {
//       // Shipping details from the form
//       shippingAddress: {
//         name: formValue.name,
//         email: formValue.email,
//         phone: formValue.phone,
//         streetAddress: formValue.streetAddress,
//         townCity: formValue.townCity,
//         zipCode: formValue.zipCode,
//       },
//       // Payment method from the form
//       paymentMethod: formValue.paymentMethod,
//       // Book details from the cart
//       books: this.orderSummaryItems.map((item) => ({
//         book: item.bookId,
//         quantity: item.quantity,
//       })),
//       // Total amount
//       total: this.getTotal(),
//     };

//     this.orderService.placeOrder(orderData).subscribe({
//       next: (res: any) => {
//         this.messageService.add({
//           severity: 'success',
//           summary: 'Success',
//           detail: 'Your order has been placed!',
//         });
//         this.cartService.clearCart();
//         this.router.navigate(['/profile']);
//       },
//       error: (err: any) => {
//         this.messageService.add({
//           severity: 'error',
//           summary: 'Order Failed',
//           detail: err.error.message || 'An unexpected error occurred.',
//         });
//       },
//     });
//   }
// }

// src/app/users/checkout/checkout.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cartService.service';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { CartItem } from '../../interfaces/book-details';
import { PaypalService } from '../../services/paypal.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

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
  currentStep: number = 1;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
    private paypalService: PaypalService
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

    // 1. استقبل الكارت وتخزينه
    this.cartService.cartItems$.subscribe((cartItems: CartItem[]) => {
      this.orderSummaryItems = cartItems.map((item) => ({
        bookId: item.book._id,
        name: item.book.title,
        price: item.book.price,
        quantity: item.quantity,
      }));

      // 2. لما توصل بيانات الكارت، نكمل captureOrder
      if (orderId && this.orderSummaryItems.length > 0) {
        this.captureOrder(orderId);
      }
    });

    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      this.checkoutForm.patchValue({
        name: currentUser.name || '',
        email: currentUser.email || '',
      });
    }
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
    const total = this.getTotal();
    this.paypalService.createOrder(total).subscribe({
      next: (res) => {
        localStorage.setItem('checkout_cart', JSON.stringify(this.cartService.getCartSnapshot()));
        window.location.href = res.approvalUrl;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'PayPal Error',
          detail: err.error.message || 'Failed to create PayPal order.',
        });
      }
    });
  }
  private captureOrder(orderID: string): void {
    const books = this.orderSummaryItems.map((item) => ({
      book: item.bookId,       // ← هنا لازم يكون .bookId مش ._id
      quantity: item.quantity
    }));
    const total = this.getTotal();

    console.log('📦 books:', books);       // ← مؤقتًا للمراجعة
    console.log('💰 total:', total);       // ← مؤقتًا للمراجعة

    this.paypalService.captureOrder(orderID, books, total).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Order placed successfully!',
        });
        this.cartService.clearCart();
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Capture Failed',
          detail: err.error.message || 'Failed to capture PayPal payment.',
        });
      },
    });
  }



}
