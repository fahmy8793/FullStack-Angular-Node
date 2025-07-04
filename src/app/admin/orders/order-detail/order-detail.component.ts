import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

interface OrderItem {
  bookTitle: string;
  quantity: number;
  price: number;
}

interface OrderDetail {
  id: number;
  customerName: string;
  customerEmail: string;
  orderDate: string;
  shippingAddress: string;
  totalAmount: number;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  items: OrderItem[];
}

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'] // Reusing common detail styles
})
export class OrderDetailComponent implements OnInit {
  orderId: string | null = null;
  order: OrderDetail | undefined;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.orderId = params.get('id');
      if (this.orderId) {
        // In a real app, fetch order details by ID
        console.log('Fetching order details for ID:', this.orderId);
        // Mock data for order detail
        this.order = {
          id: parseInt(this.orderId),
          customerName: 'Alice Johnson',
          customerEmail: 'alice@example.com',
          orderDate: '2025-06-28',
          shippingAddress: '123 Main St, Anytown, USA 12345',
          totalAmount: 120.50,
          status: 'Pending',
          items: [
            { bookTitle: 'The Great Angular Adventure', quantity: 1, price: 29.99 },
            { bookTitle: 'Reacting to the Future', quantity: 2, price: 24.50 },
            { bookTitle: 'Vue.js Simplicity', quantity: 1, price: 19.99 }
          ]
        };
      }
    });
  }

  updateOrderStatus(newStatus: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled'): void {
    if (this.order) {
      this.order.status = newStatus;
      console.log(`Order ${this.order.id} status updated to: ${newStatus}`);
      // Call a service to update the order status in the backend
    }
  }

  backToList(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}