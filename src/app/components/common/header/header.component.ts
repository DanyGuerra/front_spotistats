import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { ButtonModule } from 'primeng/button';
import { Router, RouterModule } from '@angular/router';
import { LocalStorage } from 'src/constants/localStorage';
import { Subscription } from 'rxjs';
import { IconlogoComponent } from '../icons/iconlogo/iconlogo.component';
import { ToastService } from 'src/app/services/toast.service';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { IUserInfoStored } from 'src/app/interfaces/IUserInfoStored';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    RouterModule,
    IconlogoComponent,
    MenuModule,
    AvatarModule,
    RippleModule,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authSuscription: Subscription | null = null;
  isAuthenticated: boolean = false;
  items: MenuItem[] | undefined;
  userData!: IUserInfoStored | null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    const storedUser = localStorage.getItem(LocalStorage.UserInfo);
    const userInfo: IUserInfoStored | null = JSON.parse(storedUser!!);

    this.userData = userInfo;

    this.items = [
      {
        label: 'My stats',
        items: [
          {
            label: 'Top artists',
            icon: 'pi pi-users',
            command: () => this.navigateTo(`${userInfo?.userId}/top-artists`),
          },
          {
            label: 'Top tracks',
            icon: 'pi pi-play-circle',
            command: () => this.navigateTo(`${userInfo?.userId}/top-tracks`),
          },
          {
            label: 'Recently played',
            icon: 'pi pi-headphones',
            command: () =>
              this.navigateTo(`${userInfo?.userId}/recently-played`),
          },
        ],
      },
      {
        label: 'Profile',
        items: [
          {
            label: 'My profile',
            icon: 'pi pi-user',
            command: () => this.navigateTo(`${userInfo?.userId}`),
          },
          {
            label: 'Logout',
            icon: 'pi pi-sign-out',
            command: () => this.logout(),
          },
        ],
      },
      {
        separator: true,
      },
    ];

    if (userInfo) {
      this.authService.setAuthenticated(true);
    } else {
      this.authService.setAuthenticated(false);
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
      error: () => {
        this.toastService.showError('Error', 'Something went wrong, try later');
      },
    });
  }

  logout() {
    const storedUser = localStorage.getItem(LocalStorage.UserInfo);
    const userInfo: IUserInfoStored | null = JSON.parse(storedUser!!);
    const logId = userInfo?.logId;

    this.authService.logout(logId);
  }

  navigateTo(url: string) {
    this.router.navigate([url]);
  }

  navigateToExternalUrl(url: string): void {
    this.router.navigateByUrl(url, { skipLocationChange: true });
  }
}
