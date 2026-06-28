import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { PasswordModule } from 'primeng/password';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DropdownModule } from 'primeng/dropdown';
import { RouterModule } from '@angular/router';
import { FileUploadModule } from 'primeng/fileupload'; 
import { RecaptchaModule } from 'ng-recaptcha';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { InputOtpModule } from 'primeng/inputotp';
import { DialogModule } from 'primeng/dialog';

@NgModule({
  declarations: [AppComponent, LoginComponent, RegisterComponent,ForgotPasswordComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    NgxMaskDirective,
    PasswordModule,
    FloatLabelModule,
    DropdownModule,
    FileUploadModule,
    RecaptchaModule,
    InputOtpModule,
    DialogModule,
    RouterModule.forRoot([]),
  ],
  providers: [ConfirmationService, MessageService, provideNgxMask()],
  bootstrap: [AppComponent],
})
export class AppModule {}
