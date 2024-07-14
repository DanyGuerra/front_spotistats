import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { IResponseTopTracks } from '../interfaces/IResponseTopTracks';
import { IResponseTopArtists } from '../interfaces/IResponseTopArtists';
import { StatsService } from '../services/stats.service';

export const dataStatsResolver: ResolveFn<
  Observable<{ tracks: IResponseTopTracks; artists: IResponseTopArtists }>
> = () => {
  const statsService = inject(StatsService);
  return forkJoin({
    tracks: statsService.getTopTracks(),
    artists: statsService.getTopArtists(),
  });
};
