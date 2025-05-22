import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-arrow',
  standalone: true,
  imports: [],
  templateUrl: './icon-arrow.component.html',
  styleUrl: './icon-arrow.component.less',
})
export class IconArrowComponent {
  @Input() width: string = '70px';
  @Input() height: string = '165px';
  @Input() iconColor: string = '#1bd760';
}
