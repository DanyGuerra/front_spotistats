import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { IconMusicWavesComponent } from '../icons/icon-music-waves/icon-music-waves.component';
import gsap from 'gsap';
import { StatsService } from 'src/app/services/stats.service';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule, IconMusicWavesComponent],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.less',
})
export class LoadingComponent {
  isLoading: boolean = false;
  statsLoading: boolean = false;
  @ViewChild('svgMusicWaves', { read: ElementRef, static: false })
  svgMusicWaves!: ElementRef;

  constructor(
    private authService: AuthService,
    private statsService: StatsService
  ) {}

  ngOnInit() {
    this.authService.getLoading().subscribe((state) => {
      this.isLoading = state;
    });

    this.statsService.getLoading().subscribe((state) => {
      this.statsLoading = state;
    });
  }

  ngAfterViewInit() {
    this.animateMusicWaves();
  }

  animateMusicWaves() {
    const rects = this.svgMusicWaves.nativeElement.querySelectorAll('rect');
    gsap.fromTo(
      rects,
      { scaleY: 0.2, transformOrigin: 'center bottom' },
      {
        scaleY: 1,
        repeat: -1,
        yoyo: true,
        duration: 0.25,
        stagger: {
          each: 0.05,
          repeat: 4,
          yoyo: true,
        },
        ease: 'sine.inOut',
      }
    );
  }
}
