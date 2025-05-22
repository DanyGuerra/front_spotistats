import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-asterisk',
  standalone: true,
  imports: [],
  templateUrl: './icon-asterisk.component.html',
  styleUrl: './icon-asterisk.component.less',
})
export class IconAsteriskComponent {
  @Input() width: string = '35px';
  @Input() height: string = '35px';
  @Input() iconColor: string = '#1bd760';
}
