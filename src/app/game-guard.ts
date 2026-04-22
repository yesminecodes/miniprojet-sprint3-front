import { CanActivateFn, Router } from '@angular/router';

import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
export const gameGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    if (authService.isAdmin())
        return true;
    else {
        router.navigate(['app-forbidden']);
        return false;
    }
}; 