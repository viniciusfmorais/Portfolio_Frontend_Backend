import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { deleteCookie, getCookie } from './cookie.util';

function cleanToken(raw: string | null): string | null {
  if (!raw) return null;
  return raw.replace(/^"(.+)"$/, '$1').replace(/^Bearer\s+/i, '');
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  // Attach JWT to API calls
  const token = cleanToken(getCookie('auth-token'));
  const isApi = req.url.startsWith('/api/') || req.url.includes('/api/');
  const isAuth = req.url.startsWith('/auth') || req.url.includes('/auth/');
  if (token && isApi && !isAuth) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      const msg = (err.error?.message || err.error?.error || err.message || '').toString();

      const isJwtInvalid =
        err.status === 401 || err.status === 403 ||
        /jwt/i.test(msg) && /signature|expired|invalid/i.test(msg);

      // Avoid redirect loop: don't redirect if already on /login or calling auth endpoints
      const onLogin = router.url.startsWith('/login') || router.url === '/';
      if (isJwtInvalid && !onLogin && !isAuth) {
        deleteCookie('auth-token');
        deleteCookie('email');
        router.navigate(['/login'], { queryParams: { returnUrl: router.url } });
      }
      return throwError(() => err);
    })
  );
};
