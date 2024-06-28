import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IResponseLogin } from '../interfaces/IResponseLogin.interface';
import { IResponseAuthLog } from '../interfaces/IResponseAuthLog.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { LocalStorage } from 'src/constants/localStorage';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private hostApiSpox = environment.hostApiSpox;
  private isAuthenticatedSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private router: Router) {}

  login(): Observable<IResponseLogin> {
    return this.http.get<IResponseLogin>(
      `${this.hostApiSpox}api/v1/auth/login`,
      {
        withCredentials: true,
      }
    );
  }

  logout() {
    localStorage.removeItem(LocalStorage.LogId);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/']);
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  setAuthenticated(isAuthenticated: boolean): void {
    this.isAuthenticatedSubject.next(isAuthenticated);
  }

  getAuthLog(id: string | null): Observable<IResponseAuthLog> {
    return this.http.get<IResponseAuthLog>(
      `${this.hostApiSpox}api/v1/auth/get-log?id=${id}`,
      {
        withCredentials: true,
      }
    );
  }

  getAuthLogByUserId(id: string | null): Observable<IResponseAuthLog> {
    return this.http.get<IResponseAuthLog>(
      `${this.hostApiSpox}api/v1/auth/get-log-userid?userid=${id}`,
      {
        withCredentials: true,
      }
    );
  }
}
