import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ImageModule } from 'primeng/image';
import { TopArtistItem } from 'src/app/interfaces/IResponseTopArtists';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { TopTimeRange } from 'src/constants/types';
import { StatsService } from 'src/app/services/stats.service';
import { Subscription } from 'rxjs';
import { defaultTopRange } from 'src/constants/types';
import { SkeletonModule } from 'primeng/skeleton';
import { PaginatorModule } from 'primeng/paginator';
import { IDataPagination } from 'src/app/interfaces/IDataPagination';
import { skeletonCardNumber } from 'src/constants/types';

@Component({
  selector: 'app-tab-top-artists',
  standalone: true,
  imports: [
    CardModule,
    ImageModule,
    CommonModule,
    SelectButtonModule,
    FormsModule,
    SkeletonModule,
    PaginatorModule,
  ],
  templateUrl: './tab-top-artists.component.html',
  styleUrls: ['./tab-top-artists.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class TabTopArtistsComponent implements OnInit, OnDestroy {
  topArtists!: TopArtistItem[] | undefined;
  topArtistSubject!: Subscription;
  timeRange: TopTimeRange = defaultTopRange;
  isLoadingSuscription!: Subscription;
  isLoading: boolean = false;
  skeletonElements: number[] = [...Array(skeletonCardNumber).keys()];
  dataPagination: IDataPagination = {
    first: 0,
    rows: 0,
    totalRecords: 0,
    rowsPerPageOptions: [10, 20, 30, 40, 50],
  };

  stateOptions: any[] = [
    { label: '4 weeks', value: TopTimeRange.ShortTerm },
    { label: '6 months', value: TopTimeRange.MediumTerm },
    { label: 'lifetime', value: TopTimeRange.LongTerm },
  ];

  constructor(private statsService: StatsService) {
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
  }

  ngOnDestroy(): void {
    this.topArtistSubject.unsubscribe();
    this.isLoadingSuscription.unsubscribe();
  }

  handleImageClick(url: string) {
    window.open(url, '_blank');
  }

  onOptionChange(event: any) {
    this.statsService.setTopArtistsByRange(event.value);
  }

  onPageChange(event: any) {
    this.statsService.setTopArtistsByRange(
      this.timeRange,
      event.rows,
      event.first
    );
  }
}
