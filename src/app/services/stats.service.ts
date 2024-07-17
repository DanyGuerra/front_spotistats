import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, finalize, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IResponseUserInfo } from '../interfaces/IResponseUserInfo';
import {
  TopInfoLimit,
  TopTimeRange,
  defaultTopRange,
} from 'src/constants/types';
import { IResponseTopArtists } from '../interfaces/IResponseTopArtists';
import { IResponseTopTracks } from '../interfaces/IResponseTopTracks';
import { LocalStorage } from 'src/constants/localStorage';

@Injectable({
  providedIn: 'root',
})
export class StatsService {
  private hostApiSpox = environment.hostApiSpox;
  private hostApiSpoxContext = environment.hostApiSpoxContext;

  private topTracksSubject: BehaviorSubject<IResponseTopTracks | undefined> =
    new BehaviorSubject<IResponseTopTracks | undefined>(undefined);
  private topArtistsSubject: BehaviorSubject<IResponseTopArtists | undefined> =
    new BehaviorSubject<IResponseTopArtists | undefined>(undefined);
  private isDataLoadingSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    this.getTopArtists().subscribe({
      next: (data) => {
        this.setTopArtists(data);
      },
    });

    this.getTopTracks().subscribe({
      next: (data) => {
        this.setTopTracks(data);
      },
    });
  }

  getUserInfo(logId: string | null): Observable<IResponseUserInfo> {
    return this.http.get<IResponseUserInfo>(
      `${this.hostApiSpox}${this.hostApiSpoxContext}stats/me?id=${logId}`
    );
  }

  getTopArtists(
    limit: TopInfoLimit = 50,
    timeRange: TopTimeRange = defaultTopRange,
    offset: TopInfoLimit = 0
  ): Observable<IResponseTopArtists> {
    this.setIsDataLoading(true);
    return this.http
      .get<IResponseTopArtists>(
        `${this.hostApiSpox}${
          this.hostApiSpoxContext
        }stats/top-artists?id=${localStorage.getItem(
          LocalStorage.LogId
        )}&limit=${limit}&time_range=${timeRange}&offset=${offset}`
      )
      .pipe(
        finalize(() => {
          this.setIsDataLoading(false);
        })
      );
  }

  getTopTracks(
    timeRange: TopTimeRange = defaultTopRange,
    limit: TopInfoLimit = 50,
    offset: TopInfoLimit = 0
  ): Observable<IResponseTopTracks> {
    this.setIsDataLoading(true);
    return this.http
      .get<IResponseTopTracks>(
        `${this.hostApiSpox}${
          this.hostApiSpoxContext
        }stats/top-tracks?id=${localStorage.getItem(
          LocalStorage.LogId
        )}&limit=${limit}&time_range=${timeRange}&offset=${offset}`
      )
      .pipe(
        finalize(() => {
          this.setIsDataLoading(false);
        })
      );
  }

  setIsDataLoading(isLoading: boolean) {
    this.isDataLoadingSubject.next(isLoading);
  }

  isDataLoading(): Observable<boolean> {
    return this.isDataLoadingSubject.asObservable();
  }

  setTopTracks(topTracks: IResponseTopTracks) {
    this.topTracksSubject.next(topTracks);
  }

  setTopTracksByTimerange(
    timeRange: TopTimeRange = TopTimeRange.LongTerm,
    limit: TopInfoLimit = 50,
    offset: TopInfoLimit = 0
  ) {
    this.getTopTracks(timeRange, limit, offset).subscribe({
      next: (data) => {
        this.topTracksSubject.next(data);
      },
    });
  }

  setTopArtists(topArtists: IResponseTopArtists) {
    this.topArtistsSubject.next(topArtists);
  }

  setTopArtistsByRange(
    timeRange: TopTimeRange = TopTimeRange.LongTerm,
    limit: TopInfoLimit = 50,
    offset: TopInfoLimit = 0
  ) {
    if (!timeRange || !limit) {
      return;
    }
    this.getTopArtists(limit, timeRange, offset).subscribe({
      next: (data) => {
        this.topArtistsSubject.next(data);
      },
    });
  }

  getTopTracksSubject(): Observable<IResponseTopTracks | undefined> {
    return this.topTracksSubject.asObservable();
  }

  getTopArtistsSubject(): Observable<IResponseTopArtists | undefined> {
    return this.topArtistsSubject.asObservable();
  }
}
