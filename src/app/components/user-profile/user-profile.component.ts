import { Component } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { CardModule } from 'primeng/card';
import { ImageModule } from 'primeng/image';
import { HeaderComponent } from '../common/header/header.component';
import { CommonModule, Location } from '@angular/common';
import { TabsStatsComponent } from '../tabs-stats/tabs-stats.component';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-userprofile',
  standalone: true,
  imports: [
    TabViewModule,
    CardModule,
    ImageModule,
    HeaderComponent,
    CommonModule,
    RouterModule,
    ButtonModule,
  ],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.less'],
})
export class UserprofileComponent {
  constructor(private location: Location) {}

  goBack() {
    this.location.back();
  }
}
