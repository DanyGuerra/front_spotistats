import { Component } from '@angular/core';
import { DropdownLanguageComponent } from '../dropdown-language/dropdown-language.component';
import { getYear } from 'date-fns';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [DropdownLanguageComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.less',
})
export class FooterComponent {
  currentYear: number = getYear(new Date());
}
