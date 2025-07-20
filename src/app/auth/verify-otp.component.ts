import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MessageService } from 'primeng/api';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './verify-otp.component.html',
  styleUrl: './verify-otp.component.scss',
  providers: [MessageService],
})
export class VerifyOtpComponent implements OnInit {
  otpForm: FormGroup;
  email!: string;
  isResetFlow = false;


  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {
    this.otpForm = this.fb.group({
      otpCode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const flow = params['flow'];

      if (flow === 'reset') {
        const resetEmail = localStorage.getItem('resetEmail');
        if (!resetEmail) {
          this.router.navigate(['/forgot-password']);
          return;
        }
        this.email = resetEmail;
        this.isResetFlow = true;
      } else {
        const registerEmail = localStorage.getItem('registerEmail');
        if (!registerEmail) {
          this.router.navigate(['/register']);
          return;
        }
        this.email = registerEmail;
        this.isResetFlow = false;
      }
    });
  }


  handleVerify() {
    if (this.otpForm.invalid) {
      this.otpForm.markAllAsTouched();
      return;
    }

    const { otpCode } = this.otpForm.value;

    if (this.isResetFlow) {
      this.authService.verifyOtp(this.email, otpCode).subscribe({
        next: (res) => {
          console.log('🔐 Reset OTP Verified:', res);
          localStorage.removeItem('resetEmail');
          this.router.navigate(['/reset-password'], { queryParams: { token: res.resetToken, email: this.email } });
        },
        error: (err) => {
          console.error('❌ OTP Verification Failed (reset):', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Verification Failed',
            detail: err.error.message || 'Invalid or expired OTP.',
          });
        },
      });
    } else {
      this.authService.verifyRegisterOtp(this.email, otpCode).subscribe({
        next: (res) => {
          console.log('✅ Register OTP Verified:', res);
          localStorage.removeItem('registerEmail');
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Email verified successfully!',
          });
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('❌ OTP Verification Failed (register):', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Verification Failed',
            detail: err.error.message || 'Invalid or expired OTP.',
          });
        },
      });
    }
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
