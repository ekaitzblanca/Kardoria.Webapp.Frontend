import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

const USER_STORAGE_KEY = 'kardoria_user';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);

  const storedUser = localStorage.getItem(USER_STORAGE_KEY) ?? sessionStorage.getItem(USER_STORAGE_KEY);

  if (!storedUser) {
    return router.createUrlTree(['/']);
  }

  try {
    JSON.parse(storedUser);
    return true;
  } catch {
    return router.createUrlTree(['/']);
  }
};
