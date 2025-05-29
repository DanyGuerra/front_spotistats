import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-track',
  standalone: true,
  imports: [],
  templateUrl: './icon-track.component.html',
  styleUrl: './icon-track.component.less',
})
export class IconTrackComponent {
  @Input() width: string = '24px';
  @Input() height: string = '24px';

  @Input() iconColor: string = '#1bd760';
}
