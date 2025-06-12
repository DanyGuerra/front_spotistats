import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-timeline-svg',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './timeline-svg.component.html',
  styleUrl: './timeline-svg.component.less',
})
export class TimelineSvgComponent {}
