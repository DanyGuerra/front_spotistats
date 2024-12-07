import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { ButtonModule } from 'primeng/button';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
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
  private routerSubscription: Subscription | null = null;
  isAuthenticated: boolean = false;
  items: MenuItem[] | undefined;
  userData!: IUserInfoStored | null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateUserData();
        this.setupMenu();
      }
    });

    this.authSuscription = this.authService
      .isAuthenticated()
      .subscribe((isAuthenticated) => (this.isAuthenticated = isAuthenticated));
  }

  private updateUserData(): void {
    const storedUser = localStorage.getItem(LocalStorage.UserInfo);
    try {
      this.userData = storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      this.userData = null;
    }
    this.authService.setAuthenticated(!!this.userData);
  }

  private setupMenu(): void {
    const userId = this.userData?.userId;
    this.items = [
      {
        label: 'My stats',
        items: [
          {
            label: 'Top artists',
            icon: 'pi pi-users',
            command: () => this.navigateTo(`${userId}/top-artists`),
          },
          {
            label: 'Top tracks',
            icon: 'pi pi-play-circle',
            command: () => this.navigateTo(`${userId}/top-tracks`),
          },
          {
            label: 'Recently played',
            icon: 'pi pi-headphones',
            command: () => this.navigateTo(`${userId}/recently-played`),
          },
        ],
      },
      {
        label: 'Profile',
        items: [
          {
            label: 'My profile',
            icon: 'pi pi-user',
            command: () => this.navigateTo(`${userId}`),
          },
          {
            label: 'Logout',
            icon: 'pi pi-sign-out',
            command: () => this.logout(),
          },
        ],
      },
      { separator: true },
    ];
  }

  ngOnDestroy(): void {
    this.authSuscription?.unsubscribe();
    this.routerSubscription?.unsubscribe();
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
