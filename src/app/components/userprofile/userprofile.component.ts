import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { IResponseAuthLog } from 'src/app/interfaces/IResponseAuthLog.interface';
import {
  IResponseTopArtists,
  TopArtistItem,
} from 'src/app/interfaces/IResponseTopArtists';
import {
  IResponseTopTracks,
  TopTrackItem,
} from 'src/app/interfaces/IResponseTopTracks';
import { AuthService } from 'src/app/services/auth.service';
import { LocalStorage } from 'src/constants/localStorage';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.less'],
})
export class UserprofileComponent implements OnInit {
  topTracks!: TopTrackItem[];
  topArtists!: TopArtistItem[];

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe(({ authData }) => {
      const infoResponse: IResponseAuthLog = authData;
      localStorage.setItem(LocalStorage.LogId, infoResponse.data._id);
      localStorage.setItem(LocalStorage.UserId, infoResponse.data.usernameId);
      this.authService.setAuthenticated(true);
    });

    const dataTopArtists: IResponseTopArtists =
      this.route.snapshot.data['dataStats']['artists'];
    const dataTopTracks: IResponseTopTracks =
      this.route.snapshot.data['dataStats']['tracks'];

    this.topArtists = dataTopArtists.data.items;
    this.topTracks = dataTopTracks.data.items;
  }

  logout() {
    this.authService.logout();
  }
}
