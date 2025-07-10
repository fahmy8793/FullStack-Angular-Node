// import { CanActivateFn, Router } from '@angular/router';
// import { inject } from '@angular/core';

// import { ToastrService } from 'ngx-toastr';


// export const authGuard: CanActivateFn = (route, state) => {

//   const router = inject(Router);
//   const toastr = inject (ToastrService);
//   const isLoggedIn = !!localStorage.getItem('currentUser');

//   if (isLoggedIn) {
//     return true;
//   } else {
//     toastr.error('Please login first', 'Unauthorized',   {  positionClass: 'toast-top-center',closeButton: true,timeOut: 3000 })
//     router.navigate(['/login']);
//     return false;
//   }

// };

import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const toastr = inject(ToastrService);

  // ✅ تأكد إننا بنشتغل في بيئة المتصفح
  const isBrowser = typeof window !== 'undefined';

  const isLoggedIn = isBrowser && !!localStorage.getItem('currentUser');

  if (isLoggedIn) {
    return true;
  } else {
    if (isBrowser) {
      toastr.error('Please login first', 'Unauthorized', {
        positionClass: 'toast-top-center',
        closeButton: true,
        timeOut: 3000,
      });
      router.navigate(['/login']);
    }
    return false;
  }
};
