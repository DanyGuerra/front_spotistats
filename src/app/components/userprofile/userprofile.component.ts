import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { IResponseAuthLog } from 'src/app/interfaces/IResponseAuthLog.interface';
import { AuthService } from 'src/app/services/auth.service';
import { LocalStorage } from 'src/constants/localStorage';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.less'],
})
export class UserprofileComponent implements OnInit {
  isAuthenticated: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe(({ authData }) => {
      const infoResponse: IResponseAuthLog = authData;
      localStorage.setItem(LocalStorage.LogId, infoResponse.data._id);
      this.authService.setAuthenticated(true);
    });
  }

  logout() {
    this.authService.logout();
  }
}
