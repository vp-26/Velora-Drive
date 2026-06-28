// import { Component, inject } from '@angular/core';
// import { FormBuilder, Validators } from '@angular/forms';
// import { ActivatedRoute, Router } from '@angular/router';
// import { ConfirmationService, MessageService } from 'primeng/api';
// import { Constant } from 'src/app/constant/Constant';
// import { ApiService } from 'src/app/Service/api-service.service';
// import { APIResposnemodel } from 'src/app/Service/cars';

// type UploadedFiles = {
//   licencePhoto: File | null;
//   aadhaarPhoto: File | null;
//   customerPhoto: File | null;
// };

// @Component({
//   selector: 'app-register',
//   templateUrl: './register.component.html',
// })
// export class RegisterComponent {
//   API = inject(ApiService);
//   isEditMode = false;
//   Id = 0;

//   licenceChooseLabel = 'Upload Licence';
//   aadharChooseLabel = 'Upload Aadhar';
//   customerChooseLabel = 'Upload Photo';

//   uploadedFiles: UploadedFiles = {
//     licencePhoto: null,
//     aadhaarPhoto: null,
//     customerPhoto: null,
//   };

//   registerForm = this.formbuilder.group({
//     userId: [0],
//     name: ['', Validators.required],
//     email: ['', [Validators.required, Validators.email]],
//     mobileNo: ['', Validators.required],
//     password: ['', Validators.required],
//     dob: ['', Validators.required],
//     licencePhoto: [null, Validators.required],
//     aadhaarPhoto: [null, Validators.required],
//     customerPhoto: [null, Validators.required],
//   });

//   constructor(
//     private formbuilder: FormBuilder,
//     private router: Router,
//     private activatedRoute: ActivatedRoute,
//     private confirmationService: ConfirmationService,
//     private messageService: MessageService
//   ) {}

//   ngOnInit() {
//     this.activatedRoute.params.subscribe((params: any) => {
//       this.Id = params.id;
//       if (this.Id) {
//         this.GetUserByUserId(this.Id);
//       }
//     });
//   }

//   private buildFormData(): FormData {
//     const formData = new FormData();
//     const formValue = this.registerForm.value;

//     formData.append('userId', formValue.userId?.toString() || '0');
//     formData.append('name', formValue.name || '');
//     formData.append('email', formValue.email || '');
//     formData.append('mobileNo', formValue.mobileNo || '');
//     formData.append('password', formValue.password || '');
//     formData.append('dob', formValue.dob || '');

//     if (this.uploadedFiles.licencePhoto) {
//       formData.append('licencePhoto', this.uploadedFiles.licencePhoto);
//     }
//     if (this.uploadedFiles.aadhaarPhoto) {
//       formData.append('aadhaarPhoto', this.uploadedFiles.aadhaarPhoto);
//     }
//     if (this.uploadedFiles.customerPhoto) {
//       formData.append('customerPhoto', this.uploadedFiles.customerPhoto);
//     }

//     return formData;
//   }

//   // submit() {
//   //   const formData = this.buildFormData();

//   //   this.API.addNewUser(formData).subscribe((res: APIResposnemodel) => {
//   //     if (res.result) {
//   //       this.messageService.add({
//   //         severity: 'success',
//   //         summary: 'Success',
//   //         detail: res.message,
//   //       });
//   //       this.router.navigate(['/login']);
//   //     } else {
//   //       this.messageService.add({
//   //         severity: 'error',
//   //         summary: 'Error',
//   //         detail: res.message,
//   //       });
//   //     }
//   //   });
//   // }

//   submit() {
//   const formData = this.buildFormData();

//   this.API.addNewUser(formData).subscribe({
//     next: (res: APIResposnemodel) => {
//       if (res.result) {
//         this.messageService.add({
//           severity: 'success',
//           summary: 'Success',
//           detail: res.message,
//         });
//         this.router.navigate(['/login']);
//       } else {
//         this.messageService.add({
//           severity: 'error',
//           summary: 'Error',
//           detail: res.message,
//         });
//       }
//     },
//     error: (err) => {
//       console.error('API Error:', err);

//       this.messageService.add({
//         severity: 'error',
//         summary: 'Error',
//         detail: err.error?.message || 'Something went wrong',
//       });
//     },
//   });
// }

//   update() {
//     const formData = this.buildFormData();

//     this.API.updateUser(formData).subscribe((res: APIResposnemodel) => {
//       if (res.result) {
//         this.messageService.add({
//           severity: 'success',
//           summary: 'Success',
//           detail: 'User Updated Successfully',
//         });
//         localStorage.removeItem(Constant.LOCAL_KEY);
//         this.router.navigate(['/login']);
//       } else {
//         this.messageService.add({
//           severity: 'error',
//           summary: 'Error',
//           detail: res.message,
//         });
//       }
//     });
//   }

//   GetUserByUserId(Id: number) {
//     this.API.getUserByUserId(Id).subscribe((res: APIResposnemodel) => {
//       if (res.result) {
//         this.registerForm.patchValue(res.data);
//         this.isEditMode = true;
//       } else {
//         this.messageService.add({
//           severity: 'error',
//           summary: 'Error',
//           detail: res.message,
//         });
//       }
//     });
//   }

//   onFileSelect(event: any, controlName: keyof UploadedFiles) {
//     const file = event.files?.[0];
//     if (file) {
//       this.uploadedFiles[controlName] = file;
//       this.registerForm.patchValue({ [controlName]: file.name });

//       if (controlName === 'licencePhoto') this.licenceChooseLabel = 'Selected';
//       if (controlName === 'aadhaarPhoto') this.aadharChooseLabel = 'Selected';
//       if (controlName === 'customerPhoto')
//         this.customerChooseLabel = 'Selected';
//     }
//   }
// }

import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Constant } from 'src/app/constant/Constant';
import { ApiService } from 'src/app/Service/api-service.service';
import { APIResposnemodel } from 'src/app/Service/cars';

type UploadedFiles = {
  licencePhoto: File | null;
  aadhaarPhoto: File | null;
  customerPhoto: File | null;
};

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  API = inject(ApiService);
  isEditMode = false;
  Id = 0;
  value: string = '';
  email: string = '';
  otp: string = '';
  message: string = '';
  licenceChooseLabel = 'Upload Licence';
  aadharChooseLabel = 'Upload Aadhar';
  customerChooseLabel = 'Upload Photo';
  resetPasswordForm: FormGroup;
  otpDialogVisible: boolean = false;

  uploadedFiles: UploadedFiles = {
    licencePhoto: null,
    aadhaarPhoto: null,
    customerPhoto: null,
  };

  registerForm = this.formbuilder.group({
    userId: [0],
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    mobileNo: ['', Validators.required],
    password: ['', Validators.required],
    dob: ['', Validators.required],
    licencePhoto: [null, Validators.required],
    aadhaarPhoto: [null, Validators.required],
    customerPhoto: [null, Validators.required],
  });

  constructor(
    private formbuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.resetPasswordForm = this.formbuilder.group({
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  ngOnInit() {
    const storedUser = localStorage.getItem(Constant.LOCAL_KEY);

    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        this.email = parsed.email;
        console.log('Logged user email:', this.email);
      } catch (err) {
        console.error('Error parsing localStorage user:', err);
      }
    }

    this.activatedRoute.params.subscribe((params: any) => {
      this.Id = params.id;
      if (this.Id) {
        this.GetUserByUserId(this.Id);
      }
    });
  }

  private buildFormData(): FormData {
    const formData = new FormData();
    const formValue = this.registerForm.value;

    formData.append('userId', formValue.userId?.toString() || '0');
    formData.append('name', formValue.name || '');
    formData.append('email', formValue.email || '');
    formData.append('mobileNo', formValue.mobileNo || '');
    formData.append('password', formValue.password || '');
    formData.append('dob', formValue.dob || '');

    if (this.uploadedFiles.licencePhoto) {
      formData.append('licencePhoto', this.uploadedFiles.licencePhoto);
    }
    if (this.uploadedFiles.aadhaarPhoto) {
      formData.append('aadhaarPhoto', this.uploadedFiles.aadhaarPhoto);
    }
    if (this.uploadedFiles.customerPhoto) {
      formData.append('customerPhoto', this.uploadedFiles.customerPhoto);
    }

    return formData;
  }

  submit() {
    const formData = this.buildFormData();

    this.API.addNewUser(formData).subscribe({
      next: (res: APIResposnemodel) => {
        if (res.result) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: res.message,
          });
          this.router.navigate(['/login']);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: res.message,
          });
        }
      },
      error: (err) => {
        console.error('API Error:', err);

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'Something went wrong',
        });
      },
    });
  }

  allowNumbersOnly(event: KeyboardEvent) {
    const charCode = event.key;
    if (!/^[0-9]$/.test(charCode)) {
      event.preventDefault();
    }
  }

  resendOtp() {
    this.API.sendOtp(this.email).subscribe({
      next: (res: APIResposnemodel) => {
        this.message = res.message || 'OTP sent to your email. Please verify.';
        this.messageService.add({
          severity: 'info',
          summary: 'OTP Sent',
          detail: `OTP sent to ${this.email}`,
        });
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'Failed to send OTP',
        });
      },
    });
  }

  update() {
    console.log('Email', this.email);
    if (!this.email) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Email not found!',
      });
      return;
    }

    if (!this.value) {
      this.API.sendOtp(this.email).subscribe({
        next: (res: APIResposnemodel) => {
          this.message =
            res.message || 'OTP sent to your email. Please verify.';
          this.messageService.add({
            severity: 'info',
            summary: 'OTP Sent',
            detail: `OTP sent to ${this.email}`,
          });
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error?.message || 'Failed to send OTP',
          });
        },
      });
      return;
    }

    const otpValue = Array.isArray(this.value)
      ? this.value.join('')
      : this.value;

    if (!otpValue) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please enter OTP',
      });
      return;
    }

    this.API.verifyOtp(this.email, otpValue).subscribe({
      next: (res: APIResposnemodel) => {
        this.messageService.add({
          severity: 'success',
          summary: 'OTP Verified',
          detail: 'OTP verified successfully!',
        });

        const formData = this.buildFormData();
        this.API.updateUser(formData).subscribe((res: APIResposnemodel) => {
          if (res.result) {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'User Updated Successfully',
            });
            localStorage.removeItem(Constant.LOCAL_KEY);
            this.router.navigate(['/login']);
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: res.message,
            });
          }
        });
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Invalid OTP',
          detail: err.error?.message || 'Invalid OTP',
        });
      },
    });
  }

  GetUserByUserId(Id: number) {
    this.API.getUserByUserId(Id).subscribe((res: APIResposnemodel) => {
      if (res.result) {
        this.registerForm.patchValue(res.data);
        this.isEditMode = true;
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: res.message,
        });
      }
    });
  }

  onFileSelect(event: any, controlName: keyof UploadedFiles) {
    const file = event.files?.[0];
    if (file) {
      this.uploadedFiles[controlName] = file;
      this.registerForm.patchValue({ [controlName]: file.name });

      if (controlName === 'licencePhoto') this.licenceChooseLabel = 'Selected';
      if (controlName === 'aadhaarPhoto') this.aadharChooseLabel = 'Selected';
      if (controlName === 'customerPhoto')
        this.customerChooseLabel = 'Selected';
    }
  }

  openOtpDialog() {
    this.API.sendOtp(this.email).subscribe({
      next: (res: APIResposnemodel) => {
        this.messageService.add({
          severity: 'info',
          summary: 'OTP Sent',
          detail: `OTP sent to ${this.email}`,
        });
        this.otpDialogVisible = true;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'Failed to send OTP',
        });
      },
    });
  }
}
