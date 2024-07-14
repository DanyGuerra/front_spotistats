import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ImageModule } from 'primeng/image';
import {
  IResponseTopTracks,
  TopTrackItem,
} from 'src/app/interfaces/IResponseTopTracks';
import { AudioPlayerComponent } from '../common/audio-player/audio-player.component';
import { CommonModule } from '@angular/common';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { TopTimeRange, defaultTopRange } from 'src/constants/types';
import { DropdownModule } from 'primeng/dropdown';
import { ActivatedRoute } from '@angular/router';
import { StatsService } from 'src/app/services/stats.service';
import { Subscription } from 'rxjs';

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
  ],
  templateUrl: './tab-top-tracks.component.html',
  styleUrls: ['./tab-top-tracks.component.less'],
})
export class TabTopTracksComponent {
  topTracks!: TopTrackItem[] | undefined;
  topTracksSuscription!: Subscription;

  stateOptions: any[] = [
    { label: '4 weeks', value: TopTimeRange.ShortTerm },
    { label: '6 months', value: TopTimeRange.MediumTerm },
    { label: 'lifetime', value: TopTimeRange.LongTerm },
  ];

  value: string = defaultTopRange;

  constructor(
    private route: ActivatedRoute,
    private statsService: StatsService
  ) {}

  ngOnInit(): void {
    const dataTopTracks: IResponseTopTracks =
      this.route.snapshot.data['dataStats']['tracks'];

    this.statsService.setTopTracks(dataTopTracks);

    this.topTracksSuscription = this.statsService
      .getTopTracksSubject()
      .subscribe((data) => {
        this.topTracks = data?.data.items;
      });
  }

  handleImageClick(url: string) {
    window.open(url, '_blank');
  }

  onChangeHandle(event: any){
if (event.value === null || event.value === undefined) {
      this.value = defaultTopRange;
      this.statsService.setTopTracksByTimerange(defaultTopRange);
    } else {
      this.value = event.value;
      this.statsService.setTopTracksByTimerange(event.value);
    }
  }
}
