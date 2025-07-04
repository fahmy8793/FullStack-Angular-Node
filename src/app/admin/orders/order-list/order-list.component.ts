import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Order {
  id: number;
  customerName: string;
  orderDate: string;
  totalAmount: number;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
}

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'] // Reusing common list styles
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];

  ngOnInit(): void {
    // Mock data
    this.orders = [
      { id: 1001, customerName: 'Alice Johnson', orderDate: '2025-06-28', totalAmount: 120.50, status: 'Pending' },
      { id: 1002, customerName: 'Bob Williams', orderDate: '2025-06-27', totalAmount: 75.00, status: 'Shipped' },
      { id: 1003, customerName: 'Charlie Brown', orderDate: '2025-06-26', totalAmount: 210.75, status: 'Delivered' },
      { id: 1004, customerName: 'Diana Prince', orderDate: '2025-06-25', totalAmount: 45.99, status: 'Pending' },
    ];
  }
}