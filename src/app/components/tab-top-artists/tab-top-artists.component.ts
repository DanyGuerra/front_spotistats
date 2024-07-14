import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ImageModule } from 'primeng/image';
import {
  IResponseTopArtists,
  TopArtistItem,
} from 'src/app/interfaces/IResponseTopArtists';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { TopTimeRange } from 'src/constants/types';
import { ActivatedRoute } from '@angular/router';
import { StatsService } from 'src/app/services/stats.service';
import { Subscription } from 'rxjs';
import { defaultTopRange } from 'src/constants/types';

@Component({
  selector: 'app-tab-top-artists',
  standalone: true,
  imports: [
    CardModule,
    ImageModule,
    CommonModule,
    SelectButtonModule,
    FormsModule,
  ],
  templateUrl: './tab-top-artists.component.html',
  styleUrls: ['./tab-top-artists.component.less'],
})
export class TabTopArtistsComponent implements OnInit, OnDestroy {
  topArtists!: TopArtistItem[] | undefined;
  topArtistSubject!: Subscription;
  value: string = defaultTopRange;

  stateOptions: any[] = [
    { label: '4 weeks', value: TopTimeRange.ShortTerm },
    { label: '6 months', value: TopTimeRange.MediumTerm },
    { label: 'lifetime', value: TopTimeRange.LongTerm },
  ];

  constructor(
    private route: ActivatedRoute,
    private statsService: StatsService
  ) {}

  ngOnInit(): void {
    const dataTopArtists: IResponseTopArtists =
      this.route.snapshot.data['dataStats']['artists'];

    this.statsService.setTopArtists(dataTopArtists);

    this.topArtistSubject = this.statsService
      .getTopArtistsSubject()
      .subscribe((data) => {
        this.topArtists = data?.data.items;
      });
  }

  ngOnDestroy(): void {
    this.topArtistSubject.unsubscribe();
  }

  handleImageClick(url: string) {
    window.open(url, '_blank');
  }

  onOptionChange(event: any) {
    if (event.value === null || event.value === undefined) {
      this.value = defaultTopRange;
      this.statsService.setTopArtistsByRange(defaultTopRange);
    } else {
      this.value = event.value;
      this.statsService.setTopArtistsByRange(event.value);
    }
  }
}
