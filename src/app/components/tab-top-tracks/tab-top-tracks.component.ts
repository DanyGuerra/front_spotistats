import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ImageModule } from 'primeng/image';
import { TopTrackItem } from 'src/app/interfaces/IResponseTopTracks';
import { AudioPlayerComponent } from '../common/audio-player/audio-player.component';
import { CommonModule } from '@angular/common';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import {
  TopTimeRange,
  defaultTopRange,
  initialIsLoading,
} from 'src/constants/types';
import { DropdownModule } from 'primeng/dropdown';
import { StatsService } from 'src/app/services/stats.service';
import { Subscription } from 'rxjs';
import { SkeletonModule } from 'primeng/skeleton';
import { PaginatorModule } from 'primeng/paginator';
import { IDataPagination } from 'src/app/interfaces/IDataPagination';
import { skeletonCardNumber } from 'src/constants/types';
import { ILoadingSubject } from 'src/app/interfaces/ILoadingSubject';

@Component({
  selector: 'app-tab-top-tracks',
  standalone: true,

  imports: [
    CardModule,
    ImageModule,
    AudioPlayerComponent,
    CommonModule,
    SelectButtonModule,
    FormsModule,
    DropdownModule,
    SkeletonModule,
    PaginatorModule,
  ],
  templateUrl: './tab-top-tracks.component.html',
  styleUrls: ['./tab-top-tracks.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class TabTopTracksComponent implements OnInit, OnDestroy {
  topTracks!: TopTrackItem[] | undefined;
  isLoading: ILoadingSubject = initialIsLoading;
  topTracksSuscription!: Subscription;
  isLoadingSuscription!: Subscription;
  skeletonElements: number[] = [...Array(skeletonCardNumber).keys()];
  dataPagination: IDataPagination = {
    first: 0,
    rows: 50,
    totalRecords: 0,
    rowsPerPageOptions: [10, 20, 30, 40, 50],
  };

  stateOptions: any[] = [
    { label: '4 weeks', value: TopTimeRange.ShortTerm },
    { label: '6 months', value: TopTimeRange.MediumTerm },
    { label: 'lifetime', value: TopTimeRange.LongTerm },
  ];

  value: TopTimeRange = defaultTopRange;

  constructor(private statsService: StatsService) {
    this.statsService.setTopTracksByTimerange(TopTimeRange.ShortTerm);
  }

  ngOnInit(): void {
    this.topTracksSuscription = this.statsService
      .getTopTracksSubject()
      .subscribe((data) => {
        if (data && data.data) {
          this.topTracks = data.data.items;
          this.dataPagination = {
            ...this.dataPagination,
            first: data.data.offset,
            totalRecords: data.data.total,
            rows: data.data.limit,
          };
        }
      });

    this.isLoadingSuscription = this.statsService
      .isDataLoading()
      .subscribe((isLoading) => {
        this.isLoading = isLoading;
      });
  }

  ngOnDestroy(): void {
    this.topTracksSuscription.unsubscribe();
  }

  handleImageClick(url: string) {
    window.open(url, '_blank');
  }

  onChangeHandle(event: any) {
    this.statsService.setTopTracksByTimerange(event.value);
  }

  onPageChange(event: any) {
    this.statsService.setTopTracksByTimerange(
      this.value,
      event.rows,
      event.first
    );
  }
}
