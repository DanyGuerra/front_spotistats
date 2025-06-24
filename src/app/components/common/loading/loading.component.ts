import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { IconMusicWavesComponent } from '../icons/icon-music-waves/icon-music-waves.component';
import gsap from 'gsap';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule, IconMusicWavesComponent],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.less',
})
export class LoadingComponent {
  isLoading: boolean = false;
  @ViewChild('svgMusicWaves', { read: ElementRef, static: false })
  svgMusicWaves!: ElementRef;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.getLoading().subscribe((state) => {
      this.isLoading = state;
    });
  }

  ngAfterViewInit() {
    this.animateMusicWaves();
  }

  animateMusicWaves() {
    const rects = this.svgMusicWaves.nativeElement.querySelectorAll('rect');
    gsap.fromTo(
      rects,
      { scaleY: 1.1, transformOrigin: 'center center' },
      {
        scaleY: 0,
        repeat: -1,
        yoyo: true,
        duration: 0.5,
        ease: 'power1.inOut',
        stagger: 0.02,
      }
    );
  }
}
