import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalStorage } from 'src/constants/localStorage';
import { IUserInfoStored } from 'src/app/interfaces/IUserInfoStored';
import { ImageModule } from 'primeng/image';

@Component({
  selector: 'app-card-user-data',
  standalone: true,
  imports: [CommonModule, ImageModule],
  templateUrl: './card-user-data.component.html',
  styleUrls: ['./card-user-data.component.less'],
})
export class CardUserDataComponent implements OnInit {
  userInfo!: IUserInfoStored | null;

  ngOnInit() {
    const userDataStored = localStorage.getItem(LocalStorage.UserInfo);
    const userInfo: IUserInfoStored | null = JSON.parse(userDataStored!!);
    this.userInfo = userInfo;
  }
}
