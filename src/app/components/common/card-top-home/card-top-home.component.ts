import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RippleButtonComponent } from '../ripple-button/ripple-button.component';

@Component({
  selector: 'app-card-top-home',
  standalone: true,
  imports: [RippleButtonComponent],
  templateUrl: './card-top-home.component.html',
  styleUrl: './card-top-home.component.less',
})
export class CardTopHomeComponent {
  @Input() title!: string;
  @Input() description!: string;
  @Input() buttonTitle!: string;
  @Output() buttonClick = new EventEmitter<void>();

  handleClick() {
    this.buttonClick.emit();
  }
}
