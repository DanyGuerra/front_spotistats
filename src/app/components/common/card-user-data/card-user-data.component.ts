import { TranslateModule } from '@ngx-translate/core';
import { initialIsLoading } from './../../../../constants/types';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalStorage } from 'src/constants/localStorage';
import { IUserInfoStored } from 'src/app/interfaces/IUserInfoStored';
import { ImageModule } from 'primeng/image';
import { StatsService } from 'src/app/services/stats.service';
import { TopTimeRange } from 'src/constants/types';
import { TopArtistItem } from 'src/app/interfaces/IResponseTopArtists';
import { Track } from 'src/app/interfaces/IResponseTopTracks';
import { ArtistCardItemComponent } from '../cards/artist-card-item/artist-card-item.component';
import { TrackCardItemComponent } from '../cards/track-card-item/track-card-item.component';
import { Subscription } from 'rxjs';
import { ILoadingSubject } from 'src/app/interfaces/ILoadingSubject';
import { ArtistCardSkeletonComponent } from '../skeletons/cards/artist-card-skeleton/artist-card-skeleton.component';
import { TrackCardSkeletonComponent } from '../skeletons/cards/track-card-skeleton/track-card-skeleton.component';

@Component({
  selector: 'app-card-user-data',
  standalone: true,
  imports: [
    CommonModule,
    ImageModule,
    ArtistCardItemComponent,
    TrackCardItemComponent,
    ArtistCardSkeletonComponent,
    TrackCardSkeletonComponent,
    TranslateModule,
  ],
  templateUrl: './card-user-data.component.html',
  styleUrls: ['./card-user-data.component.less'],
})
export class CardUserDataComponent implements OnInit {
  userInfo!: IUserInfoStored | null;
  topArtist!: TopArtistItem;
  topTrack!: Track;
  isloadingSubscription!: Subscription;
  isLoading: ILoadingSubject = initialIsLoading;

  constructor(private statsService: StatsService) {}

  ngOnInit() {
    const userDataStored = localStorage.getItem(LocalStorage.UserInfo);
    const userInfo: IUserInfoStored | null = JSON.parse(userDataStored!!);
    this.statsService.getTopArtists(TopTimeRange.LongTerm, 1).subscribe({
      next: (data) => {
        this.topArtist = data.data.items[0];
      },
    });

    this.statsService.getTopTracks(TopTimeRange.LongTerm, 1).subscribe({
      next: (data) => {
        this.topTrack = data.data.items[0];
      },
    });

    this.isloadingSubscription = this.statsService.isDataLoading().subscribe({
      next: (data) => {
        this.isLoading = data;
      },
    });

    this.userInfo = userInfo;
  }
}
