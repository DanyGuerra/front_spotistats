import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IResponseLogin } from '../interfaces/IResponseLogin.interface';
import { IResponseAuthLog } from '../interfaces/IResponseAuthLog.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private hostApiSpox = environment.hostApiSpox;
  private hostApiSpoxContext = environment.hostApiSpoxContext;
  private isAuthenticatedSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private router: Router) {}

  login(): Observable<IResponseLogin> {
    return this.http.get<IResponseLogin>(
      `${this.hostApiSpox}${this.hostApiSpoxContext}auth/login`,
      {
        withCredentials: true,
      }
    );
  }

  logout() {
    localStorage.clear();
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/']);
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
