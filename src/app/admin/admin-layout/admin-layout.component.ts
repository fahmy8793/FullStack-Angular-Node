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
  { path: 'dashboard', name: 'Dashboard' },
  { path: 'products', name: 'Products' },
  { path: 'orders', name: 'Orders' },
  { path: 'customers', name: 'Customers' },
  { path: 'categories', name: 'Categories' },
  { path: 'settings', name: 'Settings' },
  { path: 'orders', name: 'Orders' } // <-- NEW: Added this link

];}