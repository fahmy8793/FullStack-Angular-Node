import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule,ToastModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [MessageService],
})
export class RegisterComponent {


  registerForm: FormGroup;
  passwordsDoNotMatch: boolean = false;

  showPassword: boolean = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private messageService: MessageService
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/
          ),
        ],
      ],
      confirmPassword: ['', [Validators.required]],
    });
  }



  handleSubmitForm() {

    console.log(this.registerForm);
    console.log("Form Submitted");

    this.passwordsDoNotMatch = false;

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { password, confirmPassword } = this.registerForm.value;

    if (password !== confirmPassword) {
      this.passwordsDoNotMatch = true;
      return;
    }

    this.authService.register(this.registerForm.value).subscribe({
      next: (res) => {
        this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Registration successful! OTP sent to your email.',
          });
        localStorage.setItem('registerEmail', this.registerForm.value.email);
        setTimeout(() => {
            this.router.navigate(['/verify-otp']);
          }, 2000); // wait 2 sec to let toast alert appear
      },
      error: (err) => {
         console.error('❌ Registration failed:', err);
          let errorMessage = 'Registration failed. Please try again.';

          if (err.status === 400 && err.error?.message === 'User already exists') {
            errorMessage = 'This email is already registered. Please log in instead.';
          }


        this.messageService.add({
          severity: 'error',
          summary: 'Registration Failed',
          detail: errorMessage,
        });

        // console.error('❌ Registration failed:', err);
        // this.messageService.add({
        //   severity: 'error',
        //   summary: 'Registration Failed',
        //   detail: err.error?.message || 'This email is already in use or another error occurred.',
        // });
      },
    });
  }
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }




}
