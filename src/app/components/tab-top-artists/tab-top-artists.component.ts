import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ImageModule } from 'primeng/image';
import { TopArtistItem } from 'src/app/interfaces/IResponseTopArtists';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import {
  LayoutDataview,
  TopInfoLimit,
  TopTimeRange,
  defaultLayout,
  initialIsLoading,
} from 'src/constants/types';
import { StatsService } from 'src/app/services/stats.service';
import { Subscription } from 'rxjs';
import { defaultTopRange } from 'src/constants/types';
import { SkeletonModule } from 'primeng/skeleton';
import { PaginatorModule } from 'primeng/paginator';
import { IDataPagination } from 'src/app/interfaces/IDataPagination';
import { initialTopItems } from 'src/constants/types';
import { ILoadingSubject } from 'src/app/interfaces/ILoadingSubject';
import { ArtistCardItemComponent } from '../common/cards/artist-card-item/artist-card-item.component';
import { ArtistCardSkeletonComponent } from '../common/skeletons/cards/artist-card-skeleton/artist-card-skeleton.component';
import { DataViewModule } from 'primeng/dataview';
import { ArtistListItemComponent } from '../common/lists/artist-list-item/artist-list-item.component';
import { ArtistListSkeletonComponent } from '../common/skeletons/lists/artist-list-skeleton/artist-list-skeleton.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TimeRangeTranslation } from 'src/app/interfaces/ILanguageTranslation';

@Component({
  selector: 'app-tab-top-artists',
  standalone: true,
  imports: [
    CardModule,
    ImageModule,
    CommonModule,
    SelectButtonModule,
    DataViewModule,
    FormsModule,
    SkeletonModule,
    PaginatorModule,
    ArtistCardItemComponent,
    ArtistCardSkeletonComponent,
    ArtistListItemComponent,
    ArtistListSkeletonComponent,
    TranslateModule,
  ],
  templateUrl: './tab-top-artists.component.html',
  styleUrls: ['./tab-top-artists.component.less'],
})
export class TabTopArtistsComponent implements OnInit, OnDestroy {
  topArtists!: TopArtistItem[] | undefined;
  topArtistSubject!: Subscription;
  timeRange: TopTimeRange = defaultTopRange;
  isLoadingSuscription!: Subscription;
  isLoading: ILoadingSubject = initialIsLoading;
  skeletonElements: number[] = Array(initialTopItems);
  actualRows: TopInfoLimit = initialTopItems;
  layout: LayoutDataview = defaultLayout;
  dataPagination: IDataPagination = {
    first: 0,
    rows: 0,
    totalRecords: 0,
    rowsPerPageOptions: [10, 20, 30, 40, 50],
  };

  timeRangeTranslations!: TimeRangeTranslation;

  stateOptions: any[] = [];

  constructor(
    private statsService: StatsService,
    private translateService: TranslateService
  ) {
    this.statsService.setTopArtistsByRange(TopTimeRange.ShortTerm);
  }

  ngOnInit(): void {
    this.topArtistSubject = this.statsService
      .getTopArtistsSubject()
      .subscribe((data) => {
        if (data && data.data) {
          this.topArtists = data?.data.items;
          this.dataPagination = {
            ...this.dataPagination,
            rows: data.data.limit,
            first: data.data.offset,
            totalRecords: data.data.total,
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
    this.topArtistSubject.unsubscribe();
    this.isLoadingSuscription.unsubscribe();
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

  onOptionChange(event: any) {
    this.statsService.setTopArtistsByRange(event.value, this.actualRows);
  }

  onPageChange(event: any) {
    this.actualRows = event.rows;
    this.skeletonElements = Array(event.rows);
    this.statsService.setTopArtistsByRange(
      this.timeRange,
      event.rows,
      event.first
    );
  }

  handleLayout(event: any) {
    this.layout = event.layout;
  }
}
