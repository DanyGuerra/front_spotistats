import { Component, EventEmitter, Input, Output } from '@angular/core';

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

  @Output() mouseIn = new EventEmitter<HTMLElement>();
  @Output() mouseOut = new EventEmitter<HTMLElement>();

  onMouseEnter(event: MouseEvent) {
    this.mouseIn.emit(event.currentTarget as HTMLElement);
  }

  onMouseLeave(event: MouseEvent) {
    this.mouseOut.emit(event.currentTarget as HTMLElement);
  }
}
