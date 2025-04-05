import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { LocalStorage } from 'src/constants/localStorage';
import { IUserInfoStored } from './interfaces/IUserInfoStored';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private translateService: TranslateService
  ) {
    this.translateService.setDefaultLang('en'); // default language
    this.translateService.use('en'); // initial language
  }

  ngOnInit(): void {
    const storedUser = localStorage.getItem(LocalStorage.UserInfo);
    const userInfo: IUserInfoStored = JSON.parse(storedUser!!);
    const idLog = userInfo?.logId;

    if (idLog) {
      this.authService.getAuthLog(idLog).subscribe({
        next: () => {
          this.authService.setAuthenticated(true);
        },
        error: () => {
          this.authService.setAuthenticated(false);
          localStorage.removeItem(LocalStorage.UserInfo);
        },
      });
    }
  }

  changeLanguage(lang: string) {
    this.translateService.use(lang); // Cambia de idioma dinámicamente
  }
}
