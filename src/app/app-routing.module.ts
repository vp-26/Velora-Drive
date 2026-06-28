import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { authGuard } from './auth/auth.guard';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'forgotpassword',
    component: ForgotPasswordComponent,
  },
  {
    path: 'register/:id',
    component: RegisterComponent,
  },
  {
    path: 'layout',
    loadChildren: () =>
      import('./components/components.module').then((m) => m.ComponentsModule),
    canActivate: [authGuard],
  },
  { 
    path: 'not-found',
    component: PageNotFoundComponent 
  },
  { 
    path: '**',
    redirectTo: 'not-found' 
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
