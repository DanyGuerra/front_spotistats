import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: '[icon-play]',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icon-play.component.html',
  styleUrls: ['./icon-play.component.less'],
})
export class IconPlayComponent {
  @Input() width: string = '24px';
  @Input() height: string = '24px';
  @Input() iconColor: string = '#000';
}
