import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
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

const skeletonCardNumber: number = 20;

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
  ],
  templateUrl: './tab-top-artists.component.html',
  styleUrls: ['./tab-top-artists.component.less'],
})
export class TabTopArtistsComponent implements OnInit, OnDestroy {
  topArtists!: TopArtistItem[] | undefined;
  topArtistSubject!: Subscription;
  value: string = defaultTopRange;
  isLoadingSuscription!: Subscription;
  isLoading: boolean = false;
  skeletonElements: number[] = [...Array(skeletonCardNumber).keys()];

  stateOptions: any[] = [
    { label: '4 weeks', value: TopTimeRange.ShortTerm },
    { label: '6 months', value: TopTimeRange.MediumTerm },
    { label: 'lifetime', value: TopTimeRange.LongTerm },
  ];

  constructor(private statsService: StatsService) {}

  ngOnInit(): void {
    this.topArtistSubject = this.statsService
      .getTopArtistsSubject()
      .subscribe((data) => {
        this.topArtists = data?.data.items;
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
}
