import { CarouselModule } from 'primeng/carousel';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { AudioPlayerComponent } from '../common/audio-player/audio-player.component';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ImageModule } from 'primeng/image';
import { Subscription } from 'rxjs';
import {
  TopTimeRange,
  defaultTopRange,
  initialIsLoading,
  itemsToShowSummary,
} from 'src/constants/types';
import { StatsService } from 'src/app/services/stats.service';
import { SkeletonModule } from 'primeng/skeleton';
import { TopArtistItem } from 'src/app/interfaces/IResponseTopArtists';
import { TopTrackItem } from 'src/app/interfaces/IResponseTopTracks';
import { DataViewModule } from 'primeng/dataview';
import { TrackPlayed } from 'src/app/interfaces/IResponseCurrentlyPlayed';
import { ILoadingSubject } from 'src/app/interfaces/ILoadingSubject';
import { generateRandomWidth } from 'src/utils/general-utils';
import { RecentlyPlayedListItemComponent } from '../common/lists/recently-played-list-item/recently-played-list-item.component';
import { RecentlyPlayedListSkeletonComponent } from '../common/skeletons/lists/recently-played-list-skeleton/recently-played-list-skeleton.component';
import { ArtistListItemComponent } from '../common/lists/artist-list-item/artist-list-item.component';
import { ArtistListSkeletonComponent } from '../common/skeletons/lists/artist-list-skeleton/artist-list-skeleton.component';

@Component({
  selector: 'app-tabs-stats',
  standalone: true,
  imports: [
    TabViewModule,
    CommonModule,
    AudioPlayerComponent,
    RecentlyPlayedListItemComponent,
    RecentlyPlayedListSkeletonComponent,
    ArtistListSkeletonComponent,
    ArtistListItemComponent,
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
export class TabsStatsComponent implements OnInit {
  topArtists!: TopArtistItem[];
  topTracks!: TopTrackItem[];
  topArtistSubject!: Subscription;
  topTracksSubject!: Subscription;
  currentlyPlayedSubject!: Subscription;
  timeRange: TopTimeRange = defaultTopRange;
  isLoadingSuscription!: Subscription;
  isLoading: ILoadingSubject = initialIsLoading;
  tracksPlayed!: TrackPlayed[];
  skeletonElements: number[] = Array(itemsToShowSummary);
  skeletonNumber: number = itemsToShowSummary;
  generateRandomWidth = generateRandomWidth;

  constructor(private statsService: StatsService) {
    this.statsService.setTopArtistsByRange(
      TopTimeRange.LongTerm,
      itemsToShowSummary
    );
    this.statsService.setTopTracksByTimerange(
      TopTimeRange.LongTerm,
      itemsToShowSummary
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

    this.currentlyPlayedSubject = this.statsService
      .getTracksCurrentlyPlayed(itemsToShowSummary)
      .subscribe((data) => {
        this.tracksPlayed = data.data.items;
      });
  }

  ngOnDestroy(): void {
    this.topArtistSubject.unsubscribe();
    this.topTracksSubject.unsubscribe();
    this.currentlyPlayedSubject.unsubscribe();
    this.isLoadingSuscription.unsubscribe();
  }

  handleClick(url: string) {
    window.open(url, '_blank');
  }
}
