import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { IResponseAuthLog } from 'src/app/interfaces/IResponseAuthLog.interface';
import { LocalStorage } from 'src/constants/localStorage';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.less'],
})
export class UserprofileComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.data.subscribe(({ authData }) => {
      const infoResponse: IResponseAuthLog = authData;
      localStorage.setItem(LocalStorage.LogId, infoResponse.data._id);
    });
  }
}
