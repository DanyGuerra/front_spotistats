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
import { ScrollerModule } from 'primeng/scroller';
import { Subscription } from 'rxjs';
import {
  TopTimeRange,
  defaultTopRange,
  skeletonCardNumber,
} from 'src/constants/types';
import { StatsService } from 'src/app/services/stats.service';
import { SkeletonModule } from 'primeng/skeleton';
import { TopArtistItem } from 'src/app/interfaces/IResponseTopArtists';
import { TopTrackItem } from 'src/app/interfaces/IResponseTopTracks';

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
    ScrollerModule,
    CarouselModule,
    RouterModule,
    ButtonModule,
    CardModule,
    ImageModule,
    SkeletonModule,
  ],
  templateUrl: './tabs-stats.component.html',
  styleUrls: ['./tabs-stats.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class TabsStatsComponent {
  topArtists: (TopArtistItem | { showMore: boolean })[] = [];
  topTracks: (TopTrackItem | { showMore: boolean })[] = [];
  topArtistSubject!: Subscription;
  topTracksSubject!: Subscription;
  timeRange: TopTimeRange = defaultTopRange;
  isLoadingSuscription!: Subscription;
  isLoading: boolean = false;
  responsiveOptions: any[] | undefined;
  skeletonElements: number[] = [...Array(skeletonCardNumber).keys()];

  constructor(private statsService: StatsService) {
    this.statsService.setTopArtistsByRange(TopTimeRange.LongTerm, 10);
    this.statsService.setTopTracksByTimerange(TopTimeRange.LongTerm, 10);
  }

  ngOnInit(): void {
    this.topArtistSubject = this.statsService
      .getTopArtistsSubject()
      .subscribe((data) => {
        if (data && data.data) {
          this.topArtists = [...data?.data.items, { showMore: true }];
        }
      });

    this.topTracksSubject = this.statsService
      .getTopTracksSubject()
      .subscribe((data) => {
        if (data && data.data) {
          this.topTracks = [...data?.data.items, { showMore: true }];
        }
      });

    this.isLoadingSuscription = this.statsService
      .isDataLoading()
      .subscribe((isLoading) => {
        this.isLoading = isLoading;
      });

    this.responsiveOptions = [
      {
        breakpoint: '1199px',
        numVisible: 5,
        numScroll: 5,
      },
      {
        breakpoint: '991px',
        numVisible: 4,
        numScroll: 4,
      },
      {
        breakpoint: '767px',
        numVisible: 2,
        numScroll: 2,
      },
    ];
  }

  ngOnDestroy(): void {
    this.topArtistSubject.unsubscribe();
    this.isLoadingSuscription.unsubscribe();
  }

  handleImageClick(url: string) {
    window.open(url, '_blank');
  }
}
