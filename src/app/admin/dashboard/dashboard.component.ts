import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import io from 'socket.io-client'; // الاستيراد الصحيح

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats: any = {};
  isLoading = true;
  socket: any;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadDashboardStats();
    this.initializeSocketConnection();
  }

  loadDashboardStats(): void {
    this.isLoading = true;
    this.adminService.getDashboardStats().subscribe(
      (response) => {
        this.stats = response;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading dashboard stats:', error);
        this.isLoading = false;
      }
    );
  }

  initializeSocketConnection(): void {
    this.socket = io('http://localhost:5000'); // عدّل العنوان عند النشر

    this.socket.on('new-order', (data: any) => {
      console.log('📢 New Order Notification:', data);
      // يمكنك عرض إشعار هنا باستخدام Toast أو Alert
      alert(`🛒 New order received: ${data?.bookTitle}`);
    });
  }
}
