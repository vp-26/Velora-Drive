import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiService } from 'src/app/Service/api-service.service';
import { Constant } from '../../constant/Constant';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  @ViewChild('captchaCanvas') captchaCanvas!: ElementRef<HTMLCanvasElement>;
  API = inject(ApiService);
  Role: any[] = [];
  captchaValue: string = '';
  captchaInput: string = '';
  captchaError: boolean = false;

  loginForm = this.formbuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    captchaInput: ['', Validators.required],
  });

  constructor(
    private formbuilder: FormBuilder,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngAfterViewInit() {
    this.generateCaptcha();
  }

  generateCaptcha() {
    const canvas = this.captchaCanvas.nativeElement;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error('Canvas context is null');
      return; 
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let captcha = '';
    for (let i = 0; i < 6; i++) {
      captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.captchaValue = captcha;

    ctx.font = '25px Arial';
    ctx.fillStyle = 'red';
    ctx.fillText(captcha, 10, 30);

    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = 'gray';
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }
  }

  login(X: any) {
    if (this.loginForm.invalid) return;

    if (this.captchaInput !== this.captchaValue) {
      this.captchaError = true;
      this.generateCaptcha();
      return;
    }
    this.captchaError = false;

    const loginEmail = this.loginForm.get('email')?.value;

    this.API.login(this.loginForm.value).subscribe((res: any) => {
      if (res.result) {
        this.API.getAllUsers().subscribe((allUsersRes: any) => {
          if (allUsersRes.result && Array.isArray(allUsersRes.data)) {
            const matchedUser = allUsersRes.data.find(  
              (user: any) => user.email === loginEmail
            );

            if (matchedUser) {
              localStorage.setItem(
                Constant.LOCAL_KEY,
                JSON.stringify(matchedUser)
              );
              localStorage.setItem(Constant.LOGIN, 'true');
              this.router.navigate(['layout']);
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: res.message,
              });
            }
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: res.message,
            });
          }
        });
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: res.message,
        });
        localStorage.setItem(Constant.LOGIN, 'false');
      }
    });
  }
  
}
