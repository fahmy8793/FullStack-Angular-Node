import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  stats = [
    { label: 'Total Books', value: '1,250', icon: '📚' },
    { label: 'Pending Orders', value: '45', icon: '📦' },
    { label: 'New Users', value: '120', icon: '👥' },
    { label: 'Revenue (Month)', value: '$15,000', icon: '💰' }
  ];
}