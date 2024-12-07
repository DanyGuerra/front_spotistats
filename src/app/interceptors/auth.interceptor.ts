import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { LocalStorage } from 'src/constants/localStorage';
import { IUserInfoStored } from '../interfaces/IUserInfoStored';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly urlsToIntercept: string[] = [
    '/stats/me',
    '/stats/top-artists',
    '/stats/top-tracks',
  ];

  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const shouldIntercept = this.urlsToIntercept.some((url) =>
      req.url.includes(url)
    );

    if (!shouldIntercept) {
      return next.handle(req);
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          const storedUser = localStorage.getItem(LocalStorage.UserInfo);
          const userInfo: IUserInfoStored = JSON.parse(storedUser!!);
          const logId = userInfo.logId;

          return this.authService.logRefresh(logId).pipe(
            switchMap(() => {
              return next.handle(req);
            }),
            catchError((refreshError) => {
              this.authService.logout(logId);
              return throwError(() => refreshError);
            })
          );
        } else {
          return throwError(() => error);
        }
      })
    );
  }
}
