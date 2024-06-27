import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';

export const authGuard: CanActivateFn = async (
  route: ActivatedRouteSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const id = route.paramMap.get('usernameid');

  try {
    const response = await firstValueFrom(authService.getAuthLog(id));
    console.log(response);
    if (response.statusCode === 200) {
      return true;
    } else {
      router.navigate(['/']);
      return false;
    }
  } catch (error) {
    router.navigate(['/']);
    return false;
  }
};
