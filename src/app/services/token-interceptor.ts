import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

const excludeUrls = ['/login', '/register', '/verifyEmail'];

function shouldExclude(url: string): boolean {
  return excludeUrls.some(excluded => url.includes(excluded));
}

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const jwt = localStorage.getItem('jwt'); 

  if (jwt && !shouldExclude(req.url)) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${jwt}`
      }
    });
    return next(clonedReq);
  }

  return next(req);
};