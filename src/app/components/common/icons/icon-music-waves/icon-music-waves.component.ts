import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-music-waves',
  standalone: true,
  imports: [],
  templateUrl: './icon-music-waves.component.html',
  styleUrl: './icon-music-waves.component.less',
})
export class IconMusicWavesComponent {
  @Input() width: string = '191';
  @Input() height: string = '43';
  @Input() iconColor: string = '#1bd760';
}
