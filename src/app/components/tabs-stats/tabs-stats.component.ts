import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ImageModule } from 'primeng/image';
import { TabViewModule } from 'primeng/tabview';
import { HeaderComponent } from '../common/header/header.component';
import { TopArtistItem } from 'src/app/interfaces/IResponseTopArtists';
import { TopTrackItem } from 'src/app/interfaces/IResponseTopTracks';

@Component({
  selector: 'app-tabs-stats',
  standalone: true,
  imports: [
    TabViewModule,
    CardModule,
    ImageModule,
    HeaderComponent,
    CommonModule,
  ],
  templateUrl: './tabs-stats.component.html',
  styleUrls: ['./tabs-stats.component.less'],
})
export class TabsStatsComponent {
  @Input() topArtists!: TopArtistItem[];
  @Input() topTracks!: TopTrackItem[];

  handleImageClick(url: string) {
    window.open(url, '_blank');
  }
}
