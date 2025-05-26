import { Component, ElementRef, ViewChild, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SpotifyIconComponent } from '../icons/icon-spotify/icon-spotify.component';
import { IconArrowComponent } from '../icons/icon-arrow/icon-arrow.component';
import { IconAsteriskComponent } from '../icons/icon-asterisk/icon-asterisk.component';
import { IconHeartComponent } from '../icons/icon-heart/icon-heart.component';
import {
  animateVerticalShift,
  beatAnimation,
  fadeIn,
  fadeOut,
  flipAnimation,
  spinSlow,
  wavesStagger,
} from 'src/utils/animations-utils';

import gsap from 'gsap';
import { CommonModule } from '@angular/common';
import { IconMusicWavesComponent } from '../icons/icon-music-waves/icon-music-waves.component';
import { GraphSvgComponent } from '../icons/graph-svg/graph-svg.component';

@Component({
  selector: 'app-home-animation',
  standalone: true,
  imports: [
    CommonModule,
    SpotifyIconComponent,
    TranslateModule,
    IconArrowComponent,
    IconAsteriskComponent,
    IconHeartComponent,
    IconMusicWavesComponent,
    GraphSvgComponent,
  ],
  templateUrl: './home-animation.component.html',
  styleUrl: './home-animation.component.less',
})
export class HomeAnimationComponent {
  @ViewChild('homeHeaderText', { static: true }) homeHeaderText!: ElementRef;

  @ViewChild('waveSvg') waveSvg!: ElementRef<HTMLElement>;
  waveRects: SVGRectElement[] = [];
  waveNodeList!: NodeList;

  isAnimated = signal(false);

  get domElements() {
    const headerText = this.homeHeaderText?.nativeElement;
    return {
      words: headerText?.querySelectorAll('.word') ?? [],
      chars: headerText?.querySelectorAll('.char') ?? [],
      iconArrow: headerText?.querySelector('.iconArrow')!,
      arrowT: headerText?.querySelector('.arrowT')!,
      oHeart: headerText?.querySelector('.oHeart')!,
      iconHeart: headerText?.querySelector('.iconHeart')!,
      backAsterisk: headerText?.querySelector('.backAsterisk')!,
      iconAsterisk: headerText?.querySelector('#iconAsterisk')!,
      backSpotify: headerText?.querySelector('.backSpotify')!,
      spotifyIcon: headerText?.querySelector('.spotifyIcon')!,
    };
  }

  ngAfterViewInit() {
    const rects = this.waveSvg.nativeElement.querySelectorAll('rect');
    this.waveNodeList = rects;
    this.waveRects = Array.from(rects) as SVGRectElement[];

    this.initialAnimation();
  }

  onMouseMove(event: MouseEvent): void {
    if (this.isAnimated()) return;

    const svgRect = this.waveSvg.nativeElement.getBoundingClientRect();
    const mouseX = event.clientX - svgRect.left;
    const mouseY = event.clientY - svgRect.top;
    const width = svgRect.width;
    const height = svgRect.height;

    this.waveRects.forEach((rect) => {
      const rectX = rect.x.baseVal.value * 2.0045;
      const distance = Math.abs(rectX - mouseX);

      const horizontalFactor = Math.max(0, 1.1 - distance / width);
      const verticalFactor = 1 - mouseY / height;

      const scale = horizontalFactor * (0.5 + verticalFactor);

      gsap.to(rect, {
        duration: 0.25,
        scaleY: scale,
        transformOrigin: 'center bottom',
        ease: 'sin.inOut',
      });
    });
  }

  private initialAnimation() {
    const {
      words,
      iconArrow,
      arrowT,
      oHeart,
      iconHeart,
      backSpotify,
      spotifyIcon,
    } = this.domElements;
    this.isAnimated.set(true);

    const timeLine = gsap.timeline();

    const timelineWaves = gsap.timeline({
      onComplete: () => {
        this.isAnimated.set(false);
      },
    });
    wavesStagger(timelineWaves, this.waveNodeList);

    const timeLine1 = gsap.timeline({ repeat: 4 });
    const timeLine2 = gsap.timeline({ repeat: 5 });
    const timeLine3 = gsap.timeline({ repeat: 5 });
    const timeLine4 = gsap.timeline({ repeat: 3, repeatDelay: 2 });

    this.fadeInChars(timeLine, words);
    flipAnimation(timeLine1, arrowT, iconArrow);
    flipAnimation(timeLine1, arrowT, iconArrow);
    this.asteriskAnimation(timeLine3);
    beatAnimation(timeLine2, oHeart, iconHeart);
    beatAnimation(timeLine2, oHeart, iconHeart);

    animateVerticalShift(timeLine4, backSpotify, spotifyIcon, '0.5');
  }

  private fadeInChars(timeLine: gsap.core.Timeline, elements: NodeList) {
    timeLine.from(elements, {
      x: 100,
      duration: 1,
      autoAlpha: 0,
      stagger: 0.1,
    });
  }

  private asteriskAnimation(timeline: gsap.core.Timeline) {
    const { backAsterisk, iconAsterisk } = this.domElements;

    fadeOut(timeline, backAsterisk);
    fadeIn(timeline, iconAsterisk);
    spinSlow(timeline, iconAsterisk);
    fadeOut(timeline, iconAsterisk);
    fadeIn(timeline, backAsterisk);
  }
}
