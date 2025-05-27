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
  scaleDownAnimation,
  scaleUpAnimation,
  spinSlow,
  wavesStagger,
} from 'src/utils/animations-utils';

import gsap from 'gsap';
import { CommonModule } from '@angular/common';
import { IconMusicWavesComponent } from '../icons/icon-music-waves/icon-music-waves.component';
import { GraphSvgComponent } from '../icons/graph-svg/graph-svg.component';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import TextPlugin from 'gsap/TextPlugin';
import SplitText from 'gsap/SplitText';

gsap.registerPlugin(MotionPathPlugin);
gsap.registerPlugin(SplitText);
gsap.registerPlugin(TextPlugin);
gsap.registerPlugin(DrawSVGPlugin);

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
  @ViewChild('graphPath', { static: true }) graphPath!: ElementRef;
  @ViewChild('wordContainer', { static: true }) wordContainerRef!: ElementRef;

  @ViewChild('iconHeart', { static: true }) heartTemplate!: ElementRef;

  @ViewChild('waveSvg') waveSvg!: ElementRef<HTMLElement>;
  waveRects: SVGRectElement[] = [];
  waveNodeList!: NodeList;

  isAnimated = signal(false);

  get domElements() {
    const headerText = this.homeHeaderText?.nativeElement;
    const svgGraphElement = this.graphPath.nativeElement;
    return {
      words: headerText?.querySelectorAll('.word') ?? [],
      chars: headerText?.querySelectorAll('.char') ?? [],
      nodesGraph: svgGraphElement?.querySelectorAll('.node') ?? [],
      iconArrow: headerText?.querySelector('.iconArrow')!,
      arrowT: headerText?.querySelector('.arrowT')!,
      oHeart: headerText?.querySelector('.oHeart')!,
      iconHeart: headerText?.querySelector('.iconHeart')!,
      backAsterisk: headerText?.querySelector('.backAsterisk')!,
      iconAsterisk: headerText?.querySelector('#iconAsterisk')!,
      backSpotify: headerText?.querySelector('.backSpotify')!,
      spotifyIcon: headerText?.querySelector('.spotifyIcon')!,
      graphPath: svgGraphElement.querySelector('#graphSvg #allPath'),
    };
  }

  ngAfterViewInit() {
    const rects = this.waveSvg.nativeElement.querySelectorAll('rect');
    this.waveNodeList = rects;
    this.waveRects = Array.from(rects) as SVGRectElement[];

    this.initialAnimation();
    this.startTextCarousel();
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

  handleMouseIn(element: HTMLElement) {
    scaleUpAnimation(element, 1.5);
  }
  handleMouseOut(element: HTMLElement) {
    scaleDownAnimation(element);
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

    this.pathDraw();
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

  private pathDraw() {
    const { graphPath, nodesGraph } = this.domElements;

    const totalLength = (graphPath as SVGPathElement).getTotalLength();
    const nodeEls = Array.from(nodesGraph) as SVGPathElement[];

    nodeEls.forEach((el) => {
      gsap.set(el, {
        scale: 0,
        autoAlpha: 0,
        transformOrigin: 'center center',
      });
    });

    const tl = gsap.timeline();

    tl.from(graphPath, {
      duration: 3,
      drawSVG: '0%',
      ease: 'power1.inOut',
    });

    const step = totalLength / nodeEls.length;
    nodeEls.forEach((el, index) => {
      const lengthAtNode = step * index;
      const time = (lengthAtNode / totalLength) * 3;

      tl.to(
        el,
        {
          scale: 1,
          autoAlpha: 1,
          duration: 0.3,
          ease: 'eslastic.out',
        },
        time
      );
    });
  }

  private startTextCarousel() {
    const phrases = [
      'stats',
      'music',
      'top tracks',
      'top artists',
      'play history',
    ];
    let index = 0;
    const el = document.querySelector('.carouselText');

    const animate = () => {
      gsap.to(el, {
        duration: 1,
        text: phrases[index],
        ease: 'power2.inOut',
        onComplete: () => {
          setTimeout(() => {
            index = (index + 1) % phrases.length;
            animate();
          }, 3000);
        },
      });
    };

    animate();
  }
}
