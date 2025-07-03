import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'Customer' | 'Admin';
  registeredDate: string;
}

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'] // Reusing common list styles
})
export class UserListComponent implements OnInit {
  users: User[] = [];

  ngOnInit(): void {
    // Mock data
    this.users = [
      { id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'Customer', registeredDate: '2024-01-15' },
      { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', role: 'Customer', registeredDate: '2024-02-20' },
      { id: 3, name: 'Admin User', email: 'admin@example.com', role: 'Admin', registeredDate: '2023-11-01' },
      { id: 4, name: 'Peter Jones', email: 'peter.j@example.com', role: 'Customer', registeredDate: '2024-05-10' },
    ];
  }
}