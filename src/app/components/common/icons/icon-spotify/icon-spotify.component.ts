import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-spotify-icon',
  standalone: true,
  imports: [],
  templateUrl: './icon-spotify.component.html',
  styleUrl: './icon-spotify.component.less',
})
export class SpotifyIconComponent {
  @Input() width: string = '54px';
  @Input() height: string = '54px';
  @Input() iconColor: string = '#1bd760';
}
