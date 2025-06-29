
import { Component, OnInit } from '@angular/core';
import {ReactiveFormsModule, FormBuilder,FormGroup,Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {


  showPassword: boolean = false;
 // Initialize form name whose type is FormGroup
  loginForm : FormGroup;

  // using FormBuilder to make the form with its form controls (inputs) and validation
  constructor(private fb:FormBuilder , private router:Router){
    this.loginForm = this.fb.group({
      email : ['',Validators.required],
      password: ['', [Validators.required]],
    })
  }


  handleSubmitForm (){
    const loginData = this.loginForm.value;

   if (loginData.email === 'amira@email.com' && loginData.password === 'Amira!123') {
      alert('✅ Login successful');
      this.router.navigate(['/']);
    } else {
      alert('❌ Invalid email or password');
    }
  }

goToRegister() {
  this.router.navigate(['/register']);
}

loginWithGoogle() {
  console.log('🔔 Google login clicked');
}


}
