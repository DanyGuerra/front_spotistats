import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { IResponseAuthLog } from '../interfaces/IResponseAuthLog.interface';

export const authResolver: ResolveFn<Observable<IResponseAuthLog>> = (
  route
) => {
  const authService = inject(AuthService);
  const userId = route.paramMap.get('usernameid');
  return authService.getAuthLog(userId);
};
