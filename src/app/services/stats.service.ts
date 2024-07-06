import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IResponseUserInfo } from '../interfaces/IResponseUserInfo';
environment;
import { TopInfoLimit, TopTimeRange } from 'src/constants/types';
import { IResponseTopArtists } from '../interfaces/IResponseTopArtists';

@Injectable({
  providedIn: 'root',
})
export class StatsService {
  private hostApiSpox = environment.hostApiSpox;
  private hostApiSpoxContext = environment.hostApiSpoxContext;

  constructor(private http: HttpClient) {}

  getUserInfo(logId: string | null): Observable<IResponseUserInfo> {
    return this.http.get<IResponseUserInfo>(
      `${this.hostApiSpox}${this.hostApiSpoxContext}stats/me?id=${logId}`
    );
  }

  getTopArtists(
    logId: string | null,
    limit: TopInfoLimit = 50,
    timeRange: TopTimeRange = TopTimeRange.LongTerm
  ): Observable<IResponseTopArtists> {
    return this.http.get<IResponseTopArtists>(
      `${this.hostApiSpox}${this.hostApiSpoxContext}stats/top-artists?id=${logId}&limit=${limit}&time_range=${timeRange}`
    );
  }
}
