import { Component, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RegisterRequest } from '../interfaces/register-request';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  passwordsDoNotMatch: boolean = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  // Initialize form name whose type is FormGroup
  registerForm: FormGroup;

  // using FormBuilder to make the form with its form controls (inputs) and validation
  constructor(private fb: FormBuilder , private router:Router, private authService :AuthService) {
    this.registerForm = this.fb.group({
      userName: ['', Validators.required],
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
    const password = this.registerForm.value.password;
    const confirmPassword = this.registerForm.value.confirmPassword;
    const data: RegisterRequest = this.registerForm.value;

    if (this.registerForm.invalid) {
      // If no field of the form is entered

      this.registerForm.markAllAsTouched(); //  display all errors
      console.log('Form not valid');
    } else {
      console.log(this.registerForm.value);
    }

    if (password !== confirmPassword) {
      this.passwordsDoNotMatch = true;
      return;
    }

      this.authService.register(data).subscribe({
      next: (res) => {
        console.log('✅ Registered:', res);
        this.router.navigate(['login']);    // Navigate To Login Page After Registration
      },
      error: (err) => {
        console.error('❌ Registration failed:', err);
      }
    });


  }
}
