import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IResponseLogin } from '../interfaces/IResponseLogin.interface';
import { IResponseAuthLog } from '../interfaces/IResponseAuthLog.interface';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private hostApiSpox = environment.hostApiSpox;
  constructor(private http: HttpClient) {}

  login(): Observable<IResponseLogin> {
    return this.http.get<IResponseLogin>(
      `${this.hostApiSpox}api/v1/auth/login`,
      {
        withCredentials: true,
      }
    );
  }

  getAuthLog(id: string | null): Observable<IResponseAuthLog> {
    return this.http.get<IResponseAuthLog>(
      `${this.hostApiSpox}api/v1/auth/get-log-userid?userid=${id}`,
      {
        withCredentials: true,
      }
    );
  }
}
