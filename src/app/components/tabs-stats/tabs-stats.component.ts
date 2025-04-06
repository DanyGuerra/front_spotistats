import { CarouselModule } from 'primeng/carousel';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ImageModule } from 'primeng/image';
import { Subscription } from 'rxjs';
import {
  LayoutDataview,
  TopTimeRange,
  defaultLayout,
  defaultTopRange,
  initialIsLoading,
  itemsToShowSummary,
} from 'src/constants/types';
import { StatsService } from 'src/app/services/stats.service';
import { SkeletonModule } from 'primeng/skeleton';
import { TopArtistItem } from 'src/app/interfaces/IResponseTopArtists';
import { Track } from 'src/app/interfaces/IResponseTopTracks';
import { DataViewModule } from 'primeng/dataview';
import { TrackPlayed } from 'src/app/interfaces/IResponseCurrentlyPlayed';
import { ILoadingSubject } from 'src/app/interfaces/ILoadingSubject';
import { RecentlyPlayedListItemComponent } from '../common/lists/recently-played-list-item/recently-played-list-item.component';
import { RecentlyPlayedListSkeletonComponent } from '../common/skeletons/lists/recently-played-list-skeleton/recently-played-list-skeleton.component';
import { ArtistListItemComponent } from '../common/lists/artist-list-item/artist-list-item.component';
import { ArtistListSkeletonComponent } from '../common/skeletons/lists/artist-list-skeleton/artist-list-skeleton.component';
import { TrackListItemComponent } from '../common/lists/track-list-item/track-list-item.component';
import { TrackListSkeletonComponent } from '../common/skeletons/lists/track-list-skeleton/track-list-skeleton.component';
import { ArtistCardItemComponent } from '../common/cards/artist-card-item/artist-card-item.component';
import { TrackCardItemComponent } from '../common/cards/track-card-item/track-card-item.component';
import { TimeFromNowPipe } from 'src/app/pipes/time-from-now.pipe';
import { ArtistCardSkeletonComponent } from '../common/skeletons/cards/artist-card-skeleton/artist-card-skeleton.component';
import { TrackCardSkeletonComponent } from '../common/skeletons/cards/track-card-skeleton/track-card-skeleton.component';
import { CardUserDataComponent } from '../common/card-user-data/card-user-data.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-tabs-stats',
  standalone: true,
  imports: [
    TabViewModule,
    CommonModule,
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
    TrackListItemComponent,
    TrackListSkeletonComponent,
    ArtistCardItemComponent,
    TrackCardItemComponent,
    TimeFromNowPipe,
    ArtistCardSkeletonComponent,
    TrackCardSkeletonComponent,
    CardUserDataComponent,
    TranslateModule,
  ],
  templateUrl: './tabs-stats.component.html',
  styleUrls: ['./tabs-stats.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class TabsStatsComponent implements OnInit {
  topArtists!: TopArtistItem[];
  topTracks!: Track[];
  topArtistSubject!: Subscription;
  topTracksSubject!: Subscription;
  currentlyPlayedSubject!: Subscription;
  timeRange: TopTimeRange = defaultTopRange;
  isLoadingSuscription!: Subscription;
  isLoading: ILoadingSubject = initialIsLoading;
  tracksPlayed!: TrackPlayed[];
  skeletonElements: number[] = Array(itemsToShowSummary);
  skeletonNumber: number = itemsToShowSummary;
  layout: LayoutDataview = defaultLayout;

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
      .getRecentlyPlayedTracks(itemsToShowSummary)
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
}
