import { TrackPlayed } from './../../../../interfaces/IResponseCurrentlyPlayed';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeFromNowPipe } from 'src/app/pipes/time-from-now.pipe';
import { AudioPlayerComponent } from '../../audio-player/audio-player.component';
import { ImageModule } from 'primeng/image';

@Component({
  selector: 'app-recently-played-list-item',
  standalone: true,
  imports: [CommonModule, TimeFromNowPipe, AudioPlayerComponent, ImageModule],
  templateUrl: './recently-played-list-item.component.html',
  styleUrls: ['./recently-played-list-item.component.less'],
})
export class RecentlyPlayedListItemComponent {
  @Input() trackPlayed!: TrackPlayed;
  @Input() showBorder: boolean = false;
}
