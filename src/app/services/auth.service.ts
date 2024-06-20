import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IResponse } from '../interfaces/response.interface';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private hostApiSpox = environment.hostApiSpox;
  constructor(private http: HttpClient) {}

  login(): Observable<IResponse> {
    return this.http.get<IResponse>(`${this.hostApiSpox}api/v1/auth/login`, {
      withCredentials: true,
    });
  }
}
