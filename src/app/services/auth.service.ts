import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IResponseLogin } from '../interfaces/IResponseLogin.interface';
import { IResponseAuthLog } from '../interfaces/IResponseAuthLog.interface';
import {
  BehaviorSubject,
  Observable,
  catchError,
  finalize,
  throwError,
} from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { ToastService } from './toast.service';
import { LocalStorage } from 'src/constants/localStorage';
import { TranslateService } from '@ngx-translate/core';
import { ToastTranslation } from '../interfaces/ILanguageTranslation';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private hostApiSpox = environment.hostApiSpox;
  private hostApiSpoxContext = environment.hostApiSpoxContext;
  private isAuthenticatedSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  private isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastService: ToastService,
    private translate: TranslateService
  ) {}

  getLoading(): Observable<boolean> {
    return this.isLoading.asObservable();
  }

  private setLoading(state: boolean): void {
    this.isLoading.next(state);
  }

  login(): Observable<IResponseLogin> {
    this.setLoading(true);
    return this.http
      .get<IResponseLogin>(
        `${this.hostApiSpox}${this.hostApiSpoxContext}auth/login`,
        {
          withCredentials: true,
        }
      )
      .pipe(
        catchError((error) => {
          this.translate
            .get('TOAST')
            .subscribe((toastTranslations: ToastTranslation) => {
              this.toastService.showError(
                toastTranslations.ERROR.TITLE,
                toastTranslations.ERROR.DESCRIPTION
              );
            });

          return throwError(() => error);
        }),
        finalize(() => this.setLoading(false))
      );
  }

  logout(logId: string | undefined) {
    this.http
      .delete<IResponseAuthLog>(
        `${this.hostApiSpox}${this.hostApiSpoxContext}auth/logout?id=${logId}`,
        {
          withCredentials: true,
        }
      )
      .subscribe({
        next: () => {
          localStorage.removeItem(LocalStorage.UserInfo);
          this.isAuthenticatedSubject.next(false);
          this.router.navigate(['/']);
        },
        error: () => {
          const toast = this.translate.instant('TOAST') as ToastTranslation;
          this.toastService.showError(
            toast.ERROR.TITLE,
            toast.ERROR.DESCRIPTION
          );
        },
      });
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  setAuthenticated(isAuthenticated: boolean): void {
    this.isAuthenticatedSubject.next(isAuthenticated);
  }

  getAuthLog(logId: string | null): Observable<IResponseAuthLog> {
    return this.http
      .get<IResponseAuthLog>(
        `${this.hostApiSpox}${this.hostApiSpoxContext}auth/get-log?id=${logId}`,
        {
          withCredentials: true,
        }
      )
      .pipe(
        catchError((error) => {
          this.translate
            .get('TOAST')
            .subscribe((toastTranslations: ToastTranslation) => {
              this.toastService.showError(
                toastTranslations.ERROR.TITLE,
                toastTranslations.ERROR.DESCRIPTION
              );
            });

          return throwError(() => error);
        })
      );
  }

  getAuthLogByUserId(userId: string | null): Observable<IResponseAuthLog> {
    this.setLoading(true);
    return this.http
      .get<IResponseAuthLog>(
        `${this.hostApiSpox}${this.hostApiSpoxContext}auth/get-log-userid?userid=${userId}`,
        {
          withCredentials: true,
        }
      )
      .pipe(
        catchError((error) => {
          this.translate
            .get('TOAST')
            .subscribe((toastTranslations: ToastTranslation) => {
              this.toastService.showError(
                toastTranslations.ERROR.TITLE,
                toastTranslations.ERROR.DESCRIPTION
              );
            });

          return throwError(() => error);
        }),
        finalize(() => this.setLoading(false))
      );
  }

  logRefresh(id: string | null): Observable<IResponseAuthLog> {
    return this.http.post<IResponseAuthLog>(
      `${this.hostApiSpox}${this.hostApiSpoxContext}auth/token/refresh?id=${id}`,
      {}
    );
  }
}
