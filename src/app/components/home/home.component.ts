import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { HomeAnimationComponent } from '../common/home-animation/home-animation.component';
import { HomeContentComponent } from '../common/home-content/home-content.component';
import { HomeTimelineComponent } from '../common/home-timeline/home-timeline.component';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
  imports: [
    HomeAnimationComponent,
    HomeContentComponent,
    HomeTimelineComponent,
  ],
})
export class HomeComponent implements OnInit, OnDestroy {
  private authSuscription: Subscription | null = null;
  isAuthenticated: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authSuscription = this.authService
      .isAuthenticated()
      .subscribe((isAuthenticated) => {
        this.isAuthenticated = isAuthenticated;
      });
  }

  ngOnDestroy(): void {
    this.authSuscription?.unsubscribe;
  }
}
