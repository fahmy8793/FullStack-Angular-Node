import { Component, OnInit } from '@angular/core';
import {ReactiveFormsModule, FormBuilder,FormGroup,Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

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

    // using FormBuilder to make the form with its form controls (inputs) and validation
    constructor(private fb:FormBuilder , private router:Router){
      this.forgotPasswordForm = this.fb.group({
        email : ['',Validators.required],

      })
    }

    handleSubmitForm(){
    const email = this.forgotPasswordForm.value.email;
    console.log('🔔 Reset password request for email:', email);
    this.router.navigate(['password/reset/done']);

   }

}
