import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-graph-svg',
  standalone: true,
  imports: [],
  templateUrl: './graph-svg.component.html',
  styleUrl: './graph-svg.component.less',
})
export class GraphSvgComponent {
  @Input() width: string = '191px';
  @Input() height: string = '113px';
}
