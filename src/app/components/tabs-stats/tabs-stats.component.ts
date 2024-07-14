import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { HeaderComponent } from '../common/header/header.component';
import { AudioPlayerComponent } from '../common/audio-player/audio-player.component';
import { TabTopArtistsComponent } from '../tab-top-artists/tab-top-artists.component';
import { TabTopTracksComponent } from '../tab-top-tracks/tab-top-tracks.component';

@Component({
  selector: 'app-tabs-stats',
  standalone: true,
  imports: [
    TabViewModule,
    HeaderComponent,
    CommonModule,
    AudioPlayerComponent,
    TabTopArtistsComponent,
    TabTopTracksComponent,
  ],
  templateUrl: './tabs-stats.component.html',
  styleUrls: ['./tabs-stats.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class TabsStatsComponent {}
