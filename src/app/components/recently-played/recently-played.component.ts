import { StatsService } from 'src/app/services/stats.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { SkeletonModule } from 'primeng/skeleton';
import {
  LayoutDataview,
  defaultCurrentlyPlayedItems,
  defaultLayout,
  initialIsLoading,
} from 'src/constants/types';
import { ImageModule } from 'primeng/image';
import { TrackPlayed } from 'src/app/interfaces/IResponseCurrentlyPlayed';
import { ILoadingSubject } from 'src/app/interfaces/ILoadingSubject';
import { RecentlyPlayedListItemComponent } from '../common/lists/recently-played-list-item/recently-played-list-item.component';
import { RecentlyPlayedListSkeletonComponent } from '../common/skeletons/lists/recently-played-list-skeleton/recently-played-list-skeleton.component';
import { TrackCardItemComponent } from '../common/cards/track-card-item/track-card-item.component';
import { TimeFromNowPipe } from 'src/app/pipes/time-from-now.pipe';
import { TrackCardSkeletonComponent } from '../common/skeletons/cards/track-card-skeleton/track-card-skeleton.component';

@Component({
  selector: 'app-recently-played',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    DataViewModule,
    SkeletonModule,
    ImageModule,
    RecentlyPlayedListItemComponent,
    RecentlyPlayedListSkeletonComponent,
    TrackCardItemComponent,
    TimeFromNowPipe,
    TrackCardSkeletonComponent,
  ],
  templateUrl: './recently-played.component.html',
  styleUrls: ['./recently-played.component.less'],
})
export class RecentlyPlayedComponent implements OnInit {
  tracksPlayed!: TrackPlayed[];
  skeletonElements: number[] = Array(defaultCurrentlyPlayedItems);
  skeletonNumber: number = defaultCurrentlyPlayedItems;
  isLoading: ILoadingSubject = initialIsLoading;
  layout: LayoutDataview = defaultLayout;

  constructor(private statsService: StatsService) {}

  ngOnInit() {
    this.statsService.getRecentlyPlayedTracks().subscribe({
      next: ({ data }) => {
        this.tracksPlayed = data.items;
      },
    });

    this.statsService.isDataLoading().subscribe({
      next: (isLoading) => {
        this.isLoading = isLoading;
      },
    });
  }
}
