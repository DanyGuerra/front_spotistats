import { StatsService } from 'src/app/services/stats.service';
import { generateRandomWidth } from './../../../utils/general-utils';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { SkeletonModule } from 'primeng/skeleton';
import { TimeFromNowPipe } from 'src/app/pipes/time-from-now.pipe';
import { initialIsLoading } from 'src/constants/types';
import { AudioPlayerComponent } from '../common/audio-player/audio-player.component';
import { ImageModule } from 'primeng/image';
import { TrackPlayed } from 'src/app/interfaces/IResponseCurrentlyPlayed';
import { ILoadingSubject } from 'src/app/interfaces/ILoadingSubject';

@Component({
  selector: 'app-recently-played',
  standalone: true,
  imports: [
    CommonModule,
    TimeFromNowPipe,
    ButtonModule,
    DataViewModule,
    SkeletonModule,
    ImageModule,
    AudioPlayerComponent,
  ],
  templateUrl: './recently-played.component.html',
  styleUrls: ['./recently-played.component.less'],
})
export class RecentlyPlayedComponent implements OnInit {
  tracksPlayed!: TrackPlayed[];
  skeletonElements: number[] = Array(50);
  generateRandomWidth = generateRandomWidth;
  isLoading: ILoadingSubject = initialIsLoading;

  constructor(private statsService: StatsService) {}

  ngOnInit() {
    this.statsService.getTracksCurrentlyPlayed().subscribe({
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
