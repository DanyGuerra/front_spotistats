import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ImageModule } from 'primeng/image';
import { AudioPlayerComponent } from '../../audio-player/audio-player.component';
import { Track } from 'src/app/interfaces/IResponseTopTracks';

@Component({
  selector: 'app-track-card-item',
  standalone: true,
  imports: [CommonModule, CardModule, ImageModule, AudioPlayerComponent],
  templateUrl: './track-card-item.component.html',
  styleUrls: ['./track-card-item.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class TrackCardItemComponent {
  @Input() trackItem!: Track;
  @Input() playedAt: string = '';
  @Input() showRank: boolean = true;

  handleImageClick(url: string) {
    window.open(url, '_blank');
  }
}
