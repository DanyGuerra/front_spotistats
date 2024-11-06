import { CarouselModule } from 'primeng/carousel';
import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { HeaderComponent } from '../common/header/header.component';
import { AudioPlayerComponent } from '../common/audio-player/audio-player.component';
import { TabTopArtistsComponent } from '../tab-top-artists/tab-top-artists.component';
import { TabTopTracksComponent } from '../tab-top-tracks/tab-top-tracks.component';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ImageModule } from 'primeng/image';
import { Subscription } from 'rxjs';
import {
  TopInfoLimit,
  TopTimeRange,
  defaultTopRange,
  initialIsLoading,
  skeletonCardNumber,
} from 'src/constants/types';
import { StatsService } from 'src/app/services/stats.service';
import { SkeletonModule } from 'primeng/skeleton';
import { TopArtistItem } from 'src/app/interfaces/IResponseTopArtists';
import { TopTrackItem } from 'src/app/interfaces/IResponseTopTracks';
import { DataViewModule } from 'primeng/dataview';
import { TrackPlayed } from 'src/app/interfaces/IResponseCurrentlyPlayed';
import * as moment from 'moment';
import { ILoadingSubject } from 'src/app/interfaces/ILoadingSubject';

@Component({
  selector: 'app-tabs-stats',
  standalone: true,
  imports: [
    TabViewModule,
    HeaderComponent,
    CommonModule,
    AudioPlayerComponent,
    TabTopArtistsComponent,
    TabTopTracksComponent,
    CarouselModule,
    RouterModule,
    ButtonModule,
    CardModule,
    ImageModule,
    SkeletonModule,
    DataViewModule,
  ],
  templateUrl: './tabs-stats.component.html',
  styleUrls: ['./tabs-stats.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class TabsStatsComponent {
  topArtists: TopArtistItem[] = [];
  topTracks: TopTrackItem[] = [];
  topArtistSubject!: Subscription;
  topTracksSubject!: Subscription;
  timeRange: TopTimeRange = defaultTopRange;
  isLoadingSuscription!: Subscription;
  isLoading: ILoadingSubject = initialIsLoading;
  tracksPlayed: TrackPlayed[] = [];
  skeletonElements: number[] = [...Array(skeletonCardNumber).keys()];
  topItemsToShow: TopInfoLimit = 5;

  constructor(private statsService: StatsService) {
    this.statsService.setTopArtistsByRange(
      TopTimeRange.LongTerm,
      this.topItemsToShow
    );
    this.statsService.setTopTracksByTimerange(
      TopTimeRange.LongTerm,
      this.topItemsToShow
    );
  }

  ngOnInit(): void {
    this.topArtistSubject = this.statsService
      .getTopArtistsSubject()
      .subscribe((data) => {
        if (data && data.data) {
          this.topArtists = data?.data.items;
        }
      });

    this.topTracksSubject = this.statsService
      .getTopTracksSubject()
      .subscribe((data) => {
        if (data && data.data) {
          this.topTracks = data?.data.items;
        }
      });

    this.isLoadingSuscription = this.statsService
      .isDataLoading()
      .subscribe((isLoading) => {
        this.isLoading = isLoading;
      });

    this.statsService
      .getTracksCurrentlyPlayed(this.topItemsToShow)
      .subscribe((data) => {
        this.tracksPlayed = data.data.items;
      });
  }

  ngOnDestroy(): void {
    this.topArtistSubject.unsubscribe();
    this.isLoadingSuscription.unsubscribe();
  }

  handleClick(url: string) {
    window.open(url, '_blank');
  }

  timeFromNowUTC(date: string, language: 'es' | 'en' = 'en'): string {
    moment.locale(language);
    return moment.utc(date).fromNow();
  }

  counterArray(n: number): any[] {
    return Array(n);
  }

  generateRandomWidth(
    minPercent: number = 5,
    maxPercent: number = 100
  ): string {
    const randomWidth =
      Math.floor(Math.random() * (maxPercent - minPercent + 1)) + minPercent;
    return `${randomWidth}%`;
  }
}
