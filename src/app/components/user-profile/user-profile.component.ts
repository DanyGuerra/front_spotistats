import { Component } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { CardModule } from 'primeng/card';
import { ImageModule } from 'primeng/image';
import { HeaderComponent } from '../common/header/header.component';
import { CommonModule } from '@angular/common';
import { TabsStatsComponent } from '../tabs-stats/tabs-stats.component';
import { RouterModule } from '@angular/router';

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
    RouterModule,
  ],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.less'],
})
export class UserprofileComponent {}
