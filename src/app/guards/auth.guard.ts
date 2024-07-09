import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';
import { LocalStorage } from 'src/constants/localStorage';

export const authGuard: CanActivateFn = async (
  route: ActivatedRouteSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const id = route.paramMap.get('usernameid');

  try {
    const response = await firstValueFrom(authService.getAuthLogByUserId(id));

    if (response.statusCode === 200) {
      localStorage.setItem(LocalStorage.LogId, response.data._id);
      localStorage.setItem(LocalStorage.UserId, response.data.usernameId);
      return true;
    } else {
      localStorage.clear();
      router.navigate(['/']);
      return false;
    }
  } catch (error) {
    router.navigate(['/']);
    return false;
  }
};
