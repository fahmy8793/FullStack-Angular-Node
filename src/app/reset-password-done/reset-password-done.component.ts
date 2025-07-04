import { Component,OnInit} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-reset-password-done',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './reset-password-done.component.html',
  styleUrl: './reset-password-done.component.scss'
})
export class ResetPasswordDoneComponent implements OnInit{
  resetForm!: FormGroup;
  email!: string;
  token!: string;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    });

    this.route.queryParams.subscribe((params) => {
      this.token = params['token'];
      this.email = params['email'];
    });
  }

  handleSubmitForm() {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    const { newPassword, confirmPassword } = this.resetForm.value;

    if (newPassword !== confirmPassword) {
      this.errorMessage = 'Passwords do not match!';
      this.successMessage = '';
      return;
    }

    this.authService.resetPassword(this.email, newPassword, this.token).subscribe({
      next: (res) => {
        this.successMessage = res.message;
        this.errorMessage = '';
        setTimeout(() => this.router.navigate(['login']), 2000);
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Reset failed';
        this.successMessage = '';
      },
    });
  }

}
