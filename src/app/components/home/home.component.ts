import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
})
export class HomeComponent implements OnInit, OnDestroy {
  private authSuscription: Subscription | null = null;
  isAuthenticated: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authSuscription = this.authService
      .isAuthenticated()
      .subscribe((isAuthenticated) => {
        this.isAuthenticated = isAuthenticated;
      });
  }

  ngOnDestroy(): void {
    this.authSuscription?.unsubscribe;
  }

  login() {
    this.authService.login().subscribe({
      next: (response) => {
        const {
          data: { url },
        } = response;
        window.location.href = url;
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });
  }

  logout() {
    this.authService.logout();
  }
}
