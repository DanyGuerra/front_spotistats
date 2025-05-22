import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-heart',
  standalone: true,
  imports: [],
  templateUrl: './icon-heart.component.html',
  styleUrl: './icon-heart.component.less',
})
export class IconHeartComponent {
  @Input() width: string = '24px';
  @Input() height: string = '24px';
  @Input() iconColor: string = '#1bd760';
}
