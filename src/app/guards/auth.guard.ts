import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
  const router = inject(Router);
  const toastr = inject(ToastrService);

  const isBrowser = typeof window !== 'undefined';

  const userString = isBrowser ? localStorage.getItem('currentUser') : null;
  const user = userString ? JSON.parse(userString) : null;

  if (!user) {
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

  // 🔐 تحقق من الدور
  const allowedRoles = route.data['roles'] as Array<string>;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (isBrowser) {
      toastr.error('You are not authorized to access this page.', 'Access Denied', {
        positionClass: 'toast-top-center',
        closeButton: true,
        timeOut: 3000,
      });
      router.navigate(['/unauthorized']);
    }
    return false;
  }

  return true;
};
