import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';
import { LocalStorage } from 'src/constants/localStorage';
import { StatsService } from '../services/stats.service';
import { IUserInfoStored } from '../interfaces/IUserInfoStored';

export const authGuard: CanActivateFn = async (
  route: ActivatedRouteSnapshot
) => {
  const authService = inject(AuthService);
  const statsService = inject(StatsService);
  const router = inject(Router);

  const id = route.paramMap.get('usernameid');

  try {
    const response = await firstValueFrom(authService.getAuthLogByUserId(id));
    const userData = await firstValueFrom(
      statsService.getUserInfo(response.data._id)
    );

    const userInfo: IUserInfoStored = {
      logId: response.data._id,
      userId: response.data.usernameId,
      displayName: userData.data.display_name,
      email: userData.data.email,
      profileImage:
        userData.data.images.length > 0 ? userData.data.images : null,
      followers: userData.data.followers,
    };

    if (response.statusCode === 200) {
      localStorage.setItem(LocalStorage.UserInfo, JSON.stringify(userInfo));
      authService.setAuthenticated(true);
      return true;
    } else {
      localStorage.clear();
      authService.setAuthenticated(false);
      router.navigate(['/']);
      return false;
    }
  } catch (error) {
    router.navigate(['/']);
    return false;
  }
};
