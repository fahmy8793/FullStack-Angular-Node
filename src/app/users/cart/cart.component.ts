// src/app/users/cart/cart.component.ts

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cartService.service';

export interface CartItem {
  id: string;
  title: string;
  author: string;
  image: string;
  price: number;
  quantity: number;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];

  constructor(private router: Router, private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = items;
    });
  }

  removeItem(itemToRemove: CartItem) {
    this.cartService.removeItem(itemToRemove);
  }

  getTotalItems(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  getTotalPrice(): number {
    return this.cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  increaseQuantity(item: CartItem) {
    this.cartService.increaseQuantity(item);
  }

  decreaseQuantity(item: CartItem) {
    if (item.quantity > 1) {

      this.cartService.decreaseQuantity(item);
    }
  }

  updateTotal() {
  }

  checkout() {
    if (this.cartItems.length > 0) {
      console.log('Proceeding to checkout');
      this.router.navigate(['/checkout']);
    } else {
      console.log('Cart is empty, cannot proceed to checkout.');
      alert('Your cart is empty .');
    }
  }
}
