import { Component, OnDestroy, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ImageModule } from 'primeng/image';
import { Track } from 'src/app/interfaces/IResponseTopTracks';
import { CommonModule } from '@angular/common';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import {
  LayoutDataview,
  TopInfoLimit,
  TopTimeRange,
  defaultLayout,
  defaultTopRange,
  initialIsLoading,
  initialTopItems,
} from 'src/constants/types';
import { DropdownModule } from 'primeng/dropdown';
import { StatsService } from 'src/app/services/stats.service';
import { Subscription } from 'rxjs';
import { SkeletonModule } from 'primeng/skeleton';
import { PaginatorModule } from 'primeng/paginator';
import { IDataPagination } from 'src/app/interfaces/IDataPagination';
import { ILoadingSubject } from 'src/app/interfaces/ILoadingSubject';
import { TrackCardItemComponent } from '../common/cards/track-card-item/track-card-item.component';
import { TrackCardSkeletonComponent } from '../common/skeletons/cards/track-card-skeleton/track-card-skeleton.component';
import { DataViewModule } from 'primeng/dataview';
import { TrackListItemComponent } from '../common/lists/track-list-item/track-list-item.component';
import { TrackListSkeletonComponent } from '../common/skeletons/lists/track-list-skeleton/track-list-skeleton.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TimeRangeTranslation } from 'src/app/interfaces/ILanguageTranslation';

@Component({
  selector: 'app-tab-top-tracks',
  standalone: true,
  imports: [
    CardModule,
    ImageModule,
    CommonModule,
    SelectButtonModule,
    FormsModule,
    DropdownModule,
    SkeletonModule,
    PaginatorModule,
    TrackCardItemComponent,
    TrackCardSkeletonComponent,
    DataViewModule,
    TrackListItemComponent,
    TrackListSkeletonComponent,
    TranslateModule,
  ],
  templateUrl: './tab-top-tracks.component.html',
  styleUrls: ['./tab-top-tracks.component.less'],
})
export class TabTopTracksComponent implements OnInit, OnDestroy {
  topTracks!: Track[] | undefined;
  isLoading: ILoadingSubject = initialIsLoading;
  topTracksSuscription!: Subscription;
  isLoadingSuscription!: Subscription;
  skeletonElements: number[] = Array(initialTopItems);
  actualRows: TopInfoLimit = initialTopItems;
  layout: LayoutDataview = defaultLayout;
  timeRangeTranslations!: TimeRangeTranslation;
  dataPagination: IDataPagination = {
    first: 0,
    rows: 50,
    totalRecords: 0,
    rowsPerPageOptions: [10, 20, 30, 40, 50],
  };

  stateOptions: any[] = [];

  value: TopTimeRange = defaultTopRange;

  constructor(
    private statsService: StatsService,
    private translateService: TranslateService
  ) {
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

    this.translateService
      .get('TIME_RANGE')
      .subscribe((value: TimeRangeTranslation) => {
        this.timeRangeTranslations = value;
        this.setStateOptions(value);
      });

    this.translateService.onLangChange.subscribe(() => {
      this.translateService
        .get('TIME_RANGE')
        .subscribe((value: TimeRangeTranslation) => {
          this.timeRangeTranslations = value;
          this.setStateOptions(value);
        });
    });
  }

  ngOnDestroy(): void {
    this.topTracksSuscription.unsubscribe();
  }

  private setStateOptions(value: TimeRangeTranslation) {
    this.stateOptions = [
      {
        label: value.SHORT_TERM,
        value: TopTimeRange.ShortTerm,
      },
      {
        label: value.MEDIUM_TERM,
        value: TopTimeRange.MediumTerm,
      },
      {
        label: value.LONG_TERM,
        value: TopTimeRange.LongTerm,
      },
    ];
  }

  handleImageClick(url: string) {
    window.open(url, '_blank');
  }

  onChangeHandle(event: any) {
    this.statsService.setTopTracksByTimerange(event.value, this.actualRows);
  }

  onPageChange(event: any) {
    this.actualRows = event.rows;
    this.skeletonElements = Array(event.rows);
    this.statsService.setTopTracksByTimerange(
      this.value,
      event.rows,
      event.first
    );
  }

  handleLayout(event: any) {
    this.layout = event.layout;
  }
}
