
import { Component, OnInit } from '@angular/core';
import {ReactiveFormsModule, FormBuilder,FormGroup,Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { error } from 'console';
import { ToastrService } from 'ngx-toastr';

declare const google: any;


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
    constructor(private fb:FormBuilder , private router:Router, private authService:AuthService,private toastr: ToastrService){
      this.loginForm = this.fb.group({
        email : ['',Validators.required],
        password: ['', [Validators.required]],
      })
    }

    // ngOnInit(): void {
    //   (window as any)['handleCredentialResponse'] = this.handleCredentialResponse.bind(this);

    //     google.accounts.id.initialize({
    //     client_id: '594089926182-nsq0trk9rmnvpcek7mmeukmjmgg5c3s9.apps.googleusercontent.com', // اكتبي Client ID الحقيقي بتاعك هنا
    //     callback: this.handleCredentialResponse.bind(this),
    //   });

    //   google.accounts.id.renderButton(
    //     document.getElementById('googleBtn'),
    //     { theme: 'outline', size: 'large' }
    //   );
    // }


    // handleCredentialResponse(response: any) {
    //   const credential = response.credential;
    //   // console.log('✅ Google credential:', credential);

    //   // simulate extracting user info from token (we're not decoding JWT here)
    //   const dummyUser = {
    //     email: 'user@gmail.com',
    //     name: 'Google User',
    //     token: credential
    //   };

    //   localStorage.setItem('currentUser', JSON.stringify(dummyUser));
    //   alert('✅ Logged in with Google (simulated)');
    //   this.router.navigate(['/']);
    // }


    handleSubmitForm () {
      const loginData = this.loginForm.value;

      this.authService.login(loginData).subscribe({
        next: (user) => {
          this.toastr.success('Login successful!', 'Success', { positionClass: 'toast-top-center',timeOut: 2000, progressBar: true});
          this.router.navigate(['/home']);
        },
        error: (err: any) => {
          this.toastr.error('Invalid credentials', 'Login Failed',{ positionClass: 'toast-top-center',timeOut: 2000,});
        }
      });
    }

  //  if (loginData.email === 'amira@email.com' && loginData.password === 'Amira!123') {
  //     alert('✅ Login successful');
  //     this.router.navigate(['/']);
  //   } else {
  //     alert('❌ Invalid email or password');
  //   }


      goToRegister() {
        this.router.navigate(['/register']);
      }
}




