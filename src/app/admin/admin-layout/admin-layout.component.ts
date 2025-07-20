import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Needed for things like ngIf, ngFor (though you'll use new control flow)
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router'; // For routing

@Component({
  selector: 'app-admin-layout',
  standalone: true, // <-- This is the key for Angular 17+ standalone components
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet], // Import what you use
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent {
 adminLinks = [
    { path: '/admin/dashboard', name: 'Dashboard', icon: '📊' },
    { path: '/admin/book-list', name: 'Books', icon: '📚' },
    { path: '/admin/orders', name: 'Orders', icon: '📦' },
    { path: '/admin/users', name: 'Users', icon: '👥' },
    { path: '/admin/settings', name: 'Settings', icon: '⚙️' }
  ];

  isSidebarCollapsed = false; // State to manage sidebar collapse/expand

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
}