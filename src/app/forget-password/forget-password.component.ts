import { Component, OnInit } from '@angular/core';
import {ReactiveFormsModule, FormBuilder,FormGroup,Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,RouterModule],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss'
})
export class ForgetPasswordComponent {
  // Initialize form name whose type is FormGroup
    forgotPasswordForm : FormGroup;
    successMessage = '';
    errorMessage = '';

    // using FormBuilder to make the form with its form controls (inputs) and validation
    constructor(private fb:FormBuilder , private router:Router, private authService:AuthService){
      this.forgotPasswordForm = this.fb.group({
        email : ['',[Validators.required, Validators.email]],

      })
    }

    handleSubmitForm(){
      if (this.forgotPasswordForm.invalid){
        this.forgotPasswordForm.markAllAsTouched();
        return;
      }
     const email = this.forgotPasswordForm.value.email;
     this.authService.requestPasswordReset(email).subscribe({
      next: (res) => {
        this.successMessage = res.message;
        this.errorMessage = '';
        this.router.navigate(['verify-otp'], { queryParams: { email } });
      },
      error: (err) => {
        this.successMessage = '';
        this.errorMessage = err.error.message || 'Something went wrong';
      },
    });

   }

}
