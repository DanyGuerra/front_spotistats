import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-replay',
  standalone: true,
  imports: [],
  templateUrl: './icon-replay.component.html',
  styleUrl: './icon-replay.component.less',
})
export class IconReplayComponent {
  @Input() width: string = '24px';
  @Input() height: string = '24px';
  @Input() iconColor: string = '#1bd760';
}
