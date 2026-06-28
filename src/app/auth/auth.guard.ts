import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Constant } from '../constant/Constant';
 
export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const isLoggedIn = !!localStorage.getItem(Constant.LOGIN);
  if (!isLoggedIn) {
    router.navigate(['/layout']);
    return false;
  }
 
  return true;
};