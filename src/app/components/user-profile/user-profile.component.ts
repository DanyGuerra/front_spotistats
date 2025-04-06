import { Component } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { CardModule } from 'primeng/card';
import { ImageModule } from 'primeng/image';
import { CommonModule, Location } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-userprofile',
  standalone: true,
  imports: [
    TabViewModule,
    CardModule,
    ImageModule,
    CommonModule,
    RouterModule,
    ButtonModule,
    TranslateModule,
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
