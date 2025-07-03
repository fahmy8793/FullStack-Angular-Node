import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // For ngModel

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'] // Reusing common detail styles
})
export class UserDetailComponent implements OnInit {
  userId: string | null = null;
  user: any = {
    name: '',
    email: '',
    role: 'Customer',
    password: '' // Only for new user, or change password
  };
  isNewUser = true;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('id');
      if (this.userId) {
        this.isNewUser = false;
        // In a real app, fetch user details by ID
        console.log('Fetching user with ID:', this.userId);
        // Mock data for editing
        this.user = {
          id: this.userId,
          name: 'Existing User Name ' + this.userId,
          email: 'user' + this.userId + '@example.com',
          role: 'Customer',
          registeredDate: '2024-03-01'
        };
      } else {
        this.isNewUser = true;
      }
    });
  }

  saveUser(): void {
    if (this.isNewUser) {
      console.log('Adding new user:', this.user);
      // Call service to add user
    } else {
      console.log('Updating user:', this.user);
      // Call service to update user
    }
    this.router.navigate(['../'], { relativeTo: this.route }); // Navigate back to list
  }

  cancel(): void {
    this.router.navigate(['../'], { relativeTo: this.route }); // Navigate back to list
  }
}