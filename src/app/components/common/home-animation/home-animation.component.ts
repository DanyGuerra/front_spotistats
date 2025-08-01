import { Component, ElementRef, ViewChild, signal } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
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
import { RippleButtonComponent } from '../ripple-button/ripple-button.component';
import { IUserInfoStored } from 'src/app/interfaces/IUserInfoStored';
import { LocalStorage } from 'src/constants/localStorage';
import { ToastService } from 'src/app/services/toast.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { forkJoin, Subscription } from 'rxjs';
import { ToastTranslation } from 'src/app/interfaces/ILanguageTranslation';

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
    RippleButtonComponent,
  ],
  templateUrl: './home-animation.component.html',
  styleUrl: './home-animation.component.less',
})
export class HomeAnimationComponent {
  userData!: IUserInfoStored | null;
  langChangeSubscription!: Subscription | null;
  carouselIntervalId!: any;
  @ViewChild('homeHeaderText')
  homeHeaderText!: ElementRef;

  @ViewChild('graphPath') graphPath!: ElementRef;
  @ViewChild('wordContainer') wordContainerRef!: ElementRef;

  @ViewChild('iconHeart') heartTemplate!: ElementRef;

  @ViewChild('waveSvg') waveSvg!: ElementRef<HTMLElement>;
  waveRects: SVGRectElement[] = [];
  waveNodeList!: NodeList;

  isAnimated = signal(false);
  currentLang: string | undefined = this.translate.currentLang;

  constructor(
    private authService: AuthService,
    private router: Router,
    public translate: TranslateService
  ) {}

  get domElements() {
    const headerText = this.homeHeaderText?.nativeElement;
    const svgGraphElement = this.graphPath?.nativeElement;

    if (!headerText || !svgGraphElement) {
      return {
        words: [],
        chars: [],
        nodesGraph: [],
        iconArrow: null,
        arrowT: null,
        oHeart: null,
        iconHeart: null,
        backAsterisk: null,
        iconAsterisk: null,
        backSpotify: null,
        spotifyIcon: null,
        graphPath: null,
        arrowTriangle: null,
      };
    }

    return {
      words: headerText.querySelectorAll('.word'),
      chars: headerText.querySelectorAll('.char'),
      nodesGraph: svgGraphElement.querySelectorAll('.node'),
      iconArrow: headerText.querySelector('.iconArrow'),
      arrowT: headerText.querySelector('.arrowT'),
      oHeart: headerText.querySelector('.oHeart'),
      iconHeart: headerText.querySelector('.iconHeart'),
      backAsterisk: headerText.querySelector('.backAsterisk'),
      iconAsterisk: headerText.querySelector('#iconAsterisk'),
      backSpotify: headerText.querySelector('.backSpotify'),
      spotifyIcon: headerText.querySelector('.spotifyIcon'),
      graphPath: svgGraphElement.querySelector('#graphSvg #allPath'),
      arrowTriangle: svgGraphElement.querySelector('#graphSvg #arrow'),

      carouselText: headerText.querySelector('.carouselText')!,
      carouselYour: headerText.querySelector('.carouselYour')!,
    };
  }

  ngOnInit() {
    const storedUser = localStorage.getItem(LocalStorage.UserInfo);
    this.userData = storedUser ? JSON.parse(storedUser) : null;

    this.currentLang =
      this.translate.currentLang || this.translate.getBrowserLang();
  }

  ngAfterViewInit() {
    const rects = this.waveSvg.nativeElement.querySelectorAll('rect');
    this.waveNodeList = rects;
    this.waveRects = Array.from(rects) as SVGRectElement[];

    setTimeout(() => {
      this.loadAndStartCarousel();
      this.initialAnimation();
    }, 100);

    this.langChangeSubscription = this.translate.onLangChange.subscribe(
      (event) => {
        this.currentLang = event.lang;
      }
    );
  }

  ngOnDestroy() {
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }

    if (this.carouselIntervalId) {
      clearInterval(this.carouselIntervalId);
    }
  }

  handleClick() {
    const userId = this.userData?.userId;

    if (userId) {
      this.navigateTo(`${userId}/`);
    } else {
      this.authService.login().subscribe({
        next: (response) => {
          const {
            data: { url },
          } = response;
          window.location.href = url;
        },
      });
    }
  }

  navigateTo(url: string) {
    this.router.navigate([url]);
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
    scaleUpAnimation(gsap.timeline(), element, 1.5);
  }

  handleMouseOut(element: HTMLElement) {
    scaleDownAnimation(gsap.timeline(), element);
  }

  initialAnimation() {
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
    const timeLineSvgDraw = gsap.timeline();

    this.fadeInChars(timeLine, words);
    flipAnimation(timeLine1, arrowT, iconArrow);
    flipAnimation(timeLine1, arrowT, iconArrow);
    this.asteriskAnimation(timeLine3);
    beatAnimation(timeLine2, oHeart, iconHeart);
    beatAnimation(timeLine2, oHeart, iconHeart);

    animateVerticalShift(timeLine4, backSpotify, spotifyIcon, '0.5');

    this.pathDraw(timeLineSvgDraw);
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

  private pathDraw(timeline: gsap.core.Timeline) {
    const { graphPath, nodesGraph, arrowTriangle } = this.domElements;

    const totalLength = (graphPath as SVGPathElement).getTotalLength();
    const nodeEls = Array.from(nodesGraph) as SVGPathElement[];
    const animationDuration = 5;

    gsap.set(arrowTriangle, { transformOrigin: 'center center' });

    nodeEls.forEach((el) => {
      gsap.set(el, {
        scale: 0,
        autoAlpha: 0,
        transformOrigin: 'center center',
      });
    });

    timeline.from(graphPath, {
      duration: animationDuration,
      drawSVG: '0%',
      ease: 'power1.inOut',
    });

    timeline.to(
      arrowTriangle,
      {
        duration: animationDuration,
        ease: 'power1.inOut',
        motionPath: {
          path: graphPath,
          align: graphPath,
          autoRotate: false,
          alignOrigin: [0.6, 0.5],
        },
      },
      '<'
    );

    const step = totalLength / nodeEls.length;
    nodeEls.forEach((el, index) => {
      const lengthAtNode = step * index;
      const time = (lengthAtNode / totalLength) * animationDuration;

      timeline.to(
        el,
        {
          scale: 1,
          autoAlpha: 1,
          duration: 0.3,
          ease: 'power1.inOut',
        },
        time
      );
    });

    scaleUpAnimation(timeline, arrowTriangle, 1.5);
    scaleDownAnimation(timeline, arrowTriangle);
  }

  private loadAndStartCarousel() {
    forkJoin({
      stats: this.translate.get('CAROUSEL.STATS'),
      your: this.translate.get('CAROUSEL.YOUR'),
    }).subscribe(({ stats, your }) => {
      this.startTextCarousel(stats, your);
    });
  }

  private startTextCarousel(phrasesStats: string[], phrasesYour: string[]) {
    const { carouselText, carouselYour } = this.domElements;

    let index = 0;

    const updateTexts = () => {
      gsap.to(carouselText, {
        duration: 1,
        text: phrasesStats[index],
        ease: 'power2.inOut',
      });

      gsap.to(carouselYour, {
        duration: 1,
        text: phrasesYour[index],
        ease: 'power2.inOut',
      });

      index = (index + 1) % phrasesStats.length;
    };

    if (this.carouselIntervalId) {
      clearInterval(this.carouselIntervalId);
    }

    updateTexts();
    this.carouselIntervalId = setInterval(updateTexts, 3000);
  }
}
