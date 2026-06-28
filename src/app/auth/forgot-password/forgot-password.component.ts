// import { HttpClient } from '@angular/common/http';
// import { Component, inject } from '@angular/core';
// import { ApiService } from 'src/app/Service/api-service.service';
// import { APIResposnemodel } from 'src/app/Service/cars';

// @Component({
//   selector: 'app-forgot-password',
//   templateUrl: './forgot-password.component.html',
// })
// export class ForgotPasswordComponent {
//   step: 'email' | 'otp' = 'email';
//   email: string = '';
//   otp: string = '';
//   message: string = '';
//   value: any;
//   API = inject(ApiService);

//   constructor(private http: HttpClient) {}

//   sendOtp() {
//     this.API.sendOtp(this.email).subscribe({
//       next: (res: APIResposnemodel) => {
//         this.message = res.message;
//         this.step = 'otp';
//       },
//       error: (err) => {
//         this.message = err.error.message || 'Error sending OTP';
//       },
//     });
//   }

//   verifyOtp() {
//     this.API.verifyOtp(this.email, this.otp).subscribe({
//       next: (res: APIResposnemodel) => {
//         this.message = 'OTP verified! Now you can reset password.';
//       },
//       error: (err) => {
//         this.message = err.error.message || 'Invalid OTP';
//       },
//     });
//   }

//   allowNumbersOnly(event: KeyboardEvent) {
//     const charCode = event.key;
//     if (!/^[0-9]$/.test(charCode)) {
//       event.preventDefault();
//     }
//   }

//   changeEmail() {
//     this.step = 'email';
//     this.value = '';
//     this.email = '';
//   }

//   resendOtp() {
//     this.sendOtp();
//     this.message = 'A new OTP has been sent to your email.';
//   }
// }

import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/Service/api-service.service';
import { APIResposnemodel } from 'src/app/Service/cars';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent implements OnInit {
  step: 'email' | 'otp' = 'email';
  email: string = '';
  otp: string = '';
  message: string = '';
  value: any;
  displayResetPassword: boolean = false;
  resetPasswordForm: FormGroup;

  API = inject(ApiService);

  constructor(private http: HttpClient, private formBuilder: FormBuilder) {
    this.resetPasswordForm = this.formBuilder.group({
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  ngOnInit() {}
  
  SendOtp() {
    this.API.sendOtp(this.email).subscribe({
      next: (res: APIResposnemodel) => {
        this.message = res.message;
        this.step = 'otp';
      },
      error: (err) => {
        this.message = err.error.message || 'Error sending OTP';
      },
    });
  }

  VerifyOtp() {
    console.log('OTP:', this.value, 'Email:', this.email);

    const otpValue = Array.isArray(this.value)
      ? this.value.join('')
      : this.value;

    if (!this.email || !otpValue) {
      this.message = 'Please enter email and OTP';
      return;
    }

    this.API.verifyOtp(this.email, otpValue).subscribe({
      next: (res: APIResposnemodel) => {
        this.message = 'OTP verified! Now you can reset password.';
        this.displayResetPassword = true;
      },
      error: (err) => {
        this.message = err.error.message || 'Invalid OTP';
      },
    });
  }

  allowNumbersOnly(event: KeyboardEvent) {
    const charCode = event.key;
    if (!/^[0-9]$/.test(charCode)) {
      event.preventDefault();
    }
  }

  changeEmail() {
    this.step = 'email';
    this.value = '';
    this.email = '';
  }

  resendOtp() {
    this.SendOtp();
    this.message = 'A new OTP has been sent to your email.';
  }

  changePassword() {
    if (
      this.resetPasswordForm.value.newPassword !==
      this.resetPasswordForm.value.confirmPassword
    ) {
      this.message = 'Passwords do not match!';
      return;
    }

    this.API.resetPassword(
      this.email,
      this.resetPasswordForm.value.newPassword
    ).subscribe({
      next: (res: APIResposnemodel) => {
        this.message = 'Password changed successfully!';
        this.displayResetPassword = false; // close modal
        this.step = 'email'; // reset step
        this.email = '';
        this.otp = '';
        this.resetPasswordForm.reset();
      },
      error: (err) => {
        this.message = err.error.message || 'Failed to update password!';
      },
    });
  }
}
