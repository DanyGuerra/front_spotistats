import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-login-error',
  templateUrl: './login-error.component.html',
  styleUrls: ['./login-error.component.less'],
})
export class LoginErrorComponent {
  constructor(
    private authService: AuthService,
    private toastService: ToastService
  ) {}
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
}
