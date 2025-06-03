import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-top-home',
  standalone: true,
  imports: [],
  templateUrl: './card-top-home.component.html',
  styleUrl: './card-top-home.component.less',
})
export class CardTopHomeComponent {
  @Input() title!: string;
  @Input() description!: string;
}
