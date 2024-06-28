import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { LocalStorage } from 'src/constants/localStorage';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const idLog = localStorage.getItem(LocalStorage.LogId);

    if (idLog) {
      this.authService.getAuthLog(idLog).subscribe(
        () => {
          this.authService.setAuthenticated(true);
        },
        () => {
          this.authService.setAuthenticated(false);
          localStorage.removeItem(LocalStorage.LogId);
        }
      );
    }
  }
}
