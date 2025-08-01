import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Track } from 'src/app/interfaces/IResponseTopTracks';
import { ImageModule } from 'primeng/image';
import { AudioPlayerComponent } from '../../audio-player/audio-player.component';

@Component({
  selector: 'app-track-list-item',
  standalone: true,
  imports: [CommonModule, ImageModule, AudioPlayerComponent],
  templateUrl: './track-list-item.component.html',
  styleUrls: ['./track-list-item.component.less'],
})
export class TrackListItemComponent {
  @Input() track!: Track;

  handleClick(url: string) {
    window.open(url, '_blank');
  }
}
