import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-nebula',
  standalone: true,
  imports: [],
  templateUrl: './nebula.component.html',
  styleUrl: './nebula.component.less',
})
export class NebulaComponent {
  @Input() width: string = '80px';
  @Input() height: string = '60px';
}
