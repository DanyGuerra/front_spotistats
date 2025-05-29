import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-artist',
  standalone: true,
  imports: [],
  templateUrl: './icon-artist.component.html',
  styleUrl: './icon-artist.component.less',
})
export class IconArtistComponent {
  @Input() width: string = '24px';
  @Input() height: string = '24px';
  @Input() iconColor: string = '#1bd760';
}
