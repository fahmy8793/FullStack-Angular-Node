import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

import { ToastrService } from 'ngx-toastr';


export const authGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const toastr = inject (ToastrService);
  const isLoggedIn = !!localStorage.getItem('currentUser');

  if (isLoggedIn) {
    return true;
  } else {
    toastr.error('Please login first', 'Unauthorized',   {  positionClass: 'toast-top-center',closeButton: true,timeOut: 3000 })
    router.navigate(['/login']);
    return false;
  }

};
