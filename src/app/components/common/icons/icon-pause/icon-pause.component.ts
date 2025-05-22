import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: '[icon-pause]',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icon-pause.component.html',
  styleUrls: ['./icon-pause.component.less'],
})
export class IconPauseComponent {
  @Input() width: string = '24px';
  @Input() height: string = '24px';
  @Input() iconColor: string = '#000';
}
