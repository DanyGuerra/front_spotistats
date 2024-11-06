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
import { IResponseCurrentlyPlayed } from '../interfaces/IResponseCurrentlyPlayed';
import { ILoadingSubject } from '../interfaces/ILoadingSubject';

@Injectable({
  providedIn: 'root',
})
export class StatsService {
  private hostApiSpox = environment.hostApiSpox;
  private hostApiSpoxContext = environment.hostApiSpoxContext;
  private initialIsLoading: ILoadingSubject = {
    tracks: false,
    artists: false,
    currentlyPlayed: false,
  };

  private topTracksSubject: BehaviorSubject<IResponseTopTracks | undefined> =
    new BehaviorSubject<IResponseTopTracks | undefined>(undefined);
  private topArtistsSubject: BehaviorSubject<IResponseTopArtists | undefined> =
    new BehaviorSubject<IResponseTopArtists | undefined>(undefined);
  private isDataLoadingSubject: BehaviorSubject<ILoadingSubject> =
    new BehaviorSubject<ILoadingSubject>(this.initialIsLoading);

  constructor(private http: HttpClient) {}

  getUserInfo(logId: string | null): Observable<IResponseUserInfo> {
    return this.http.get<IResponseUserInfo>(
      `${this.hostApiSpox}${this.hostApiSpoxContext}stats/me?id=${logId}`
    );
  }

  getTracksCurrentlyPlayed(
    limit: TopInfoLimit = 50,
    before: string = '',
    after: string = ''
  ): Observable<IResponseCurrentlyPlayed> {
    const currentState: ILoadingSubject = this.isDataLoadingSubject.value;
    const newLoadingState: ILoadingSubject = {
      ...currentState,
      currentlyPlayed: true,
    };
    this.setIsDataLoading(newLoadingState);
    return this.http
      .get<IResponseCurrentlyPlayed>(
        `${this.hostApiSpox}${
          this.hostApiSpoxContext
        }stats/recently-played?id=${localStorage.getItem(
          LocalStorage.LogId
        )}&limit=${limit}&before=${before}&after=${after}`
      )
      .pipe(
        finalize(() => {
          const currentState: ILoadingSubject = this.isDataLoadingSubject.value;
          const newLoadingState: ILoadingSubject = {
            ...currentState,
            currentlyPlayed: false,
          };
          this.setIsDataLoading(newLoadingState);
        })
      );
  }

  getTopArtists(
    timeRange: TopTimeRange = defaultTopRange,
    limit: TopInfoLimit = 20,
    offset: TopInfoLimit = 0
  ): Observable<IResponseTopArtists> {
    const currentState: ILoadingSubject = this.isDataLoadingSubject.value;
    const newLoadingState: ILoadingSubject = {
      ...currentState,
      artists: true,
    };
    this.setIsDataLoading(newLoadingState);
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
          const currentState: ILoadingSubject = this.isDataLoadingSubject.value;
          const newLoadingState: ILoadingSubject = {
            ...currentState,
            artists: false,
          };
          this.setIsDataLoading(newLoadingState);
        })
      );
  }

  getTopTracks(
    timeRange: TopTimeRange = defaultTopRange,
    limit: TopInfoLimit = 20,
    offset: TopInfoLimit = 0
  ): Observable<IResponseTopTracks> {
    const currentState: ILoadingSubject = this.isDataLoadingSubject.value;
    const newLoadingState: ILoadingSubject = {
      ...currentState,
      tracks: true,
    };
    this.setIsDataLoading(newLoadingState);
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
          const currentState: ILoadingSubject = this.isDataLoadingSubject.value;
          const newLoadingState: ILoadingSubject = {
            ...currentState,
            tracks: false,
          };
          this.setIsDataLoading(newLoadingState);
        })
      );
  }

  setIsDataLoading(isLoading: ILoadingSubject) {
    this.isDataLoadingSubject.next(isLoading);
  }

  isDataLoading(): Observable<ILoadingSubject> {
    return this.isDataLoadingSubject.asObservable();
  }

  setTopTracks(topTracks: IResponseTopTracks) {
    this.topTracksSubject.next(topTracks);
  }

  setTopTracksByTimerange(
    timeRange: TopTimeRange = TopTimeRange.LongTerm,
    limit: TopInfoLimit = 20,
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
    limit: TopInfoLimit = 20,
    offset: TopInfoLimit = 0
  ) {
    if (!timeRange || !limit) {
      return;
    }
    this.getTopArtists(timeRange, limit, offset).subscribe({
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
