import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MessageService } from 'primeng/api';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './verify-otp.component.html',
  styleUrl: './verify-otp.component.scss',
  providers: [MessageService],
})
export class VerifyOtpComponent implements OnInit {
  otpForm: FormGroup;
  email!: string;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.otpForm = this.fb.group({
      otpCode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
    });
  }

  ngOnInit(): void {
    const storedEmail = localStorage.getItem('registerEmail');
    if (!storedEmail) {
      this.router.navigate(['/register']);
      return;
    }
    this.email = storedEmail;
  }

  handleVerify() {
    if (this.otpForm.invalid) {
      this.otpForm.markAllAsTouched();
      return;
    }

    const { otpCode } = this.otpForm.value;

    this.authService.verifyRegisterOtp(this.email, otpCode).subscribe({
      next: (res) => {
        console.log('✅ OTP Verified:', res);
        localStorage.removeItem('registerEmail');
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Email verified successfully!',
        });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('❌ OTP Verification Failed:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Verification Failed',
          detail: err.error.message || 'Invalid OTP or expired.',
        });
      },
    });
  }
  resendOTP() {
    this.authService.requestPasswordReset(this.email).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'OTP Sent',
          detail: 'A new OTP has been sent to your email.',
        });
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Failed to resend OTP',
          detail: err.error.message || 'Try again later.',
        });
      },
    });
  }

}
