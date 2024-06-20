import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
})
export class HomeComponent {
  constructor(private authService: AuthService) {}
  login() {
    this.authService.login().subscribe({
      next: (response) => {
        const { data } = response;
        window.location.href = data.url;
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });
  }
}
