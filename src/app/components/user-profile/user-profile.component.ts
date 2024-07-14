import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IResponseAuthLog } from 'src/app/interfaces/IResponseAuthLog.interface';

import { AuthService } from 'src/app/services/auth.service';
import { LocalStorage } from 'src/constants/localStorage';
import { TabViewModule } from 'primeng/tabview';
import { CardModule } from 'primeng/card';
import { ImageModule } from 'primeng/image';
import { HeaderComponent } from '../common/header/header.component';
import { CommonModule } from '@angular/common';
import { TabsStatsComponent } from '../tabs-stats/tabs-stats.component';

@Component({
  selector: 'app-userprofile',
  standalone: true,
  imports: [
    TabViewModule,
    CardModule,
    ImageModule,
    HeaderComponent,
    CommonModule,
    TabsStatsComponent,
  ],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.less'],
})
export class UserprofileComponent implements OnInit {
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
  }
}
