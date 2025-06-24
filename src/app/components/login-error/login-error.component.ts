import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ToastTranslation } from 'src/app/interfaces/ILanguageTranslation';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-login-error',
  templateUrl: './login-error.component.html',
  styleUrls: ['./login-error.component.less'],
})
export class LoginErrorComponent {
  langChangeSubscription!: Subscription;
  toastTranslations!: ToastTranslation;

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.langChangeSubscription = this.translate.onLangChange.subscribe(() => {
      this.translate
        .get('TOAST')
        .subscribe((toastTranslations: ToastTranslation) => {
          this.toastTranslations = toastTranslations;
        });
    });
  }

  ngOnDestroy() {
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
      error: () => {
        this.toastService.showError(
          this.toastTranslations.ERROR.TITLE,
          this.toastTranslations.ERROR.DESCRIPTION
        );
      },
    });
  }
}
