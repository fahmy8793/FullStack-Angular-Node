import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router'; // Import RouterLink for the button

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, RouterLink], // Add RouterLink here
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {
  orderId: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.orderId = params.get('id');
      // In a real application, you would fetch order details based on this ID
      // Example: this.orderService.getOrderById(this.orderId).subscribe(data => this.order = data);
    });
  }
}