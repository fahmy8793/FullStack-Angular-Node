import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface CartItem {
  id: number;
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
export class CartComponent {
  cartItems: CartItem[] = [
    {
      id: 1,
      title: 'book One',
      author: 'Osama',
      image: 'assets/book1.webp',
      price: 15,
      quantity: 1,
    },
    {
      id: 2,
      title: 'book Two',
      author: 'Osama',
      image: 'assets/book2.webp',
      price: 20,
      quantity: 2,
    },
    {
      id: 3,
      title: 'book Three',
      author: 'Osama',
      image: 'assets/book3.webp',
      price: 30,
      quantity: 3,
    },
  ];

  removeItem(itemToremvoe: CartItem) {
    this.cartItems = this.cartItems.filter(
      (item) => item.id !== itemToremvoe.id
    );
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
    // Use CartItem if you defined the interface
    item.quantity++;
  }

  decreaseQuantity(item: CartItem) {
    // Use CartItem if you defined the interface
    if (item.quantity > 1) {
      item.quantity--;
    }
  }

  updateTotal() {}
  checkout() {}
}
