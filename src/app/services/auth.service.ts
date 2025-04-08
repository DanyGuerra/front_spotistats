import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IResponseLogin } from '../interfaces/IResponseLogin.interface';
import { IResponseAuthLog } from '../interfaces/IResponseAuthLog.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { ToastService } from './toast.service';
import { LocalStorage } from 'src/constants/localStorage';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private hostApiSpox = environment.hostApiSpox;
  private hostApiSpoxContext = environment.hostApiSpoxContext;
  private isAuthenticatedSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastService: ToastService
  ) {}

  login(): Observable<IResponseLogin> {
    return this.http.get<IResponseLogin>(
      `${this.hostApiSpox}${this.hostApiSpoxContext}auth/login`,
      {
        withCredentials: true,
      }
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
        error: (err) => {
          this.toastService.showError('Something went wrong', 'Try later');
          console.error('Error durante el logout:', err);
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
    return this.http.get<IResponseAuthLog>(
      `${this.hostApiSpox}${this.hostApiSpoxContext}auth/get-log?id=${logId}`,
      {
        withCredentials: true,
      }
    );
  }

  getAuthLogByUserId(userId: string | null): Observable<IResponseAuthLog> {
    return this.http.get<IResponseAuthLog>(
      `${this.hostApiSpox}${this.hostApiSpoxContext}auth/get-log-userid?userid=${userId}`,
      {
        withCredentials: true,
      }
    );
  }

  logRefresh(id: string | null): Observable<IResponseAuthLog> {
    return this.http.post<IResponseAuthLog>(
      `${this.hostApiSpox}${this.hostApiSpoxContext}auth/token/refresh?id=${id}`,
      {}
    );
  }
}
