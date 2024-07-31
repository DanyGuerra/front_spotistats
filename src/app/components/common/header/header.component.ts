import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { ButtonModule } from 'primeng/button';
import { Router, RouterModule } from '@angular/router';
import { LocalStorage } from 'src/constants/localStorage';
import { Subscription } from 'rxjs';
import { IconlogoComponent } from '../icons/iconlogo/iconlogo.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ButtonModule, RouterModule, IconlogoComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authSuscription: Subscription | null = null;
  isAuthenticated: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const idLog = localStorage.getItem(LocalStorage.LogId);

    if (idLog) {
      this.authService.getAuthLog(idLog).subscribe({
        next: () => {
          this.authService.setAuthenticated(true);
        },
        error: () => {
          this.authService.setAuthenticated(false);
          localStorage.removeItem(LocalStorage.LogId);
        },
      });
    }
    this.authSuscription = this.authService
      .isAuthenticated()
      .subscribe((isAuthenticated) => (this.isAuthenticated = isAuthenticated));
  }

  ngOnDestroy(): void {
    this.authSuscription?.unsubscribe();
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

  goMyProfile() {
    const displayName = localStorage.getItem(LocalStorage.UserId);
    if (displayName) {
      this.router.navigate([`/${displayName}`]);
    } else {
      this.router.navigate(['/']);
    }
  }
}
