import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { ButtonModule } from 'primeng/button';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { LocalStorage } from 'src/constants/localStorage';
import { Subscription } from 'rxjs';
import { IconlogoComponent } from '../icons/icon-logo/iconlogo.component';
import { ToastService } from 'src/app/services/toast.service';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { IUserInfoStored } from 'src/app/interfaces/IUserInfoStored';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  UserTranslation,
  StatsTranslation,
  LanguagesTranslation,
  ToastTranslation,
} from 'src/app/interfaces/ILanguageTranslation';
import { FormsModule } from '@angular/forms';
import { RippleButtonComponent } from '../ripple-button/ripple-button.component';

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
    TranslateModule,
    FormsModule,
    RippleButtonComponent,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authSuscription: Subscription | null = null;
  private routerSubscription: Subscription | null = null;
  langChangeSubscription: Subscription | null = null;
  languagesTranslations!: LanguagesTranslation;
  isAuthenticated: boolean = false;
  items: MenuItem[] | undefined;
  userData!: IUserInfoStored | null;
  userTranslations!: UserTranslation;
  statsTranslations!: StatsTranslation;

  constructor(
    private authService: AuthService,
    private router: Router,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateUserData();
      }
    });

    this.langChangeSubscription = this.translateService.onLangChange.subscribe(
      () => {
        this.translateService
          .get('USER')
          .subscribe((userTrans: UserTranslation) => {
            this.userTranslations = userTrans;
          });

        this.translateService
          .get('STATS')
          .subscribe((statsTrans: StatsTranslation) => {
            this.statsTranslations = statsTrans;
          });

        this.translateService
          .get('LANGUAGES')
          .subscribe((languagesTranslations: LanguagesTranslation) => {
            this.languagesTranslations = languagesTranslations;
          });

        this.setupMenu();
      }
    );

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

    if (this.userData) {
      this.setupMenu();
    }
  }

  private setupMenu(): void {
    const userId = this.userData?.userId;
    this.items = [
      {
        label: this.statsTranslations?.MY_STATS,
        items: [
          {
            label: this.statsTranslations?.TOP_ARTISTS,
            icon: 'pi pi-users',
            command: () => this.navigateTo(`${userId}/top-artists`),
          },
          {
            label: this.statsTranslations?.TOP_TRACKS,
            icon: 'pi pi-play-circle',
            command: () => this.navigateTo(`${userId}/top-tracks`),
          },
          {
            label: this.statsTranslations?.RECENTLY_PLAYED,
            icon: 'pi pi-replay',
            command: () => this.navigateTo(`${userId}/recently-played`),
          },
        ],
      },
      {
        label: this.userTranslations?.PROFILE,
        items: [
          {
            label: this.userTranslations?.MY_PROFILE,
            icon: 'pi pi-user',
            command: () => this.navigateTo(`${userId}`),
          },
          {
            label: this.userTranslations?.LOGOUT,
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
    this.langChangeSubscription?.unsubscribe();
    this.langChangeSubscription?.unsubscribe();
  }

  login() {
    this.authService.login().subscribe({
      next: (response) => {
        const {
          data: { url },
        } = response;
        window.location.href = url;
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
