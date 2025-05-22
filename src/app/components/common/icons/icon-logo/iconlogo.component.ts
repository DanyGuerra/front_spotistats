import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  signal,
} from '@angular/core';
import gsap from 'gsap';
import {
  beatAnimation,
  fadeIn,
  fadeOut,
  musicWaveAnimation,
  spinAnimation,
  verticalAnimation,
} from 'src/utils/animations-utils';

@Component({
  selector: 'app-iconlogo',
  standalone: true,
  templateUrl: './iconlogo.component.html',
  styleUrls: ['./iconlogo.component.less'],
})
export class IconlogoComponent implements AfterViewInit {
  @ViewChild('appLogo', { static: true }) appLogo!: ElementRef<SVGSVGElement>;
  isAnimated = signal(false);

  get svgElements() {
    const svg = this.appLogo?.nativeElement;
    return {
      firstLetter: svg?.querySelector<SVGPathElement>('#tFirstLetter')!,
      secondLetter: svg?.querySelector<SVGPathElement>('#tSecondLetter')!,
      thirdLetter: svg?.querySelector<SVGPathElement>('#tThirdLetter')!,
      firstArrow: svg?.querySelector<SVGPathElement>('#firstArrow')!,
      secondArrow: svg?.querySelector<SVGPathElement>('#secondArrow')!,
      thirdArrow: svg?.querySelector<SVGPathElement>('#thirdArrow')!,
      oSecondLetter: svg?.querySelector<SVGPathElement>('#oSecondLetter')!,
      aSixthLetter: svg?.querySelector<SVGPathElement>('#aSixthLetter')!,
      asterisk: svg?.querySelector<SVGPathElement>('#asterisk')!,
      heart: svg?.querySelector<SVGPathElement>('#heart')!,
      arrowsAll: svg?.querySelector<SVGPathElement>('#arrows')!,
      musicWavesAll: svg?.querySelector<SVGPathElement>('#musicWaves')!,
      letters: svg?.querySelectorAll<SVGPathElement>('#words path') ?? [],
      tLetters: svg?.querySelectorAll<SVGPathElement>('.tLetter') ?? [],
      arrows: svg?.querySelectorAll<SVGPathElement>('.arrow') ?? [],
      musicWaves:
        svg?.querySelectorAll<SVGPathElement>('#musicWaves rect') ?? [],
    };
  }

  ngAfterViewInit(): void {
    this.prepareInitialSvg();
    this.initialAnimation();
  }

  onHover() {
    if (this.isAnimated()) return;

    this.isAnimated.set(true);

    const {
      firstLetter,
      firstArrow,
      secondArrow,
      secondLetter,
      thirdArrow,
      thirdLetter,
      heart,
      oSecondLetter,
      tLetters,
      arrows,
      aSixthLetter,
      asterisk,
    } = this.svgElements;

    const timeline = gsap.timeline({
      onComplete: () => this.isAnimated.set(false),
    });

    const animations = [
      () => verticalAnimation(timeline, firstLetter, firstArrow),
      () => verticalAnimation(timeline, secondLetter, secondArrow),
      () => verticalAnimation(timeline, thirdLetter, thirdArrow),
      () => beatAnimation(timeline, oSecondLetter, heart),
      () => verticalAnimation(timeline, tLetters, arrows),
      () => spinAnimation(timeline, aSixthLetter, asterisk),
      () => {
        this.musicWavesAnimation(timeline);
        beatAnimation(timeline, oSecondLetter, heart);
      },
    ];

    const randomIndex = Math.floor(Math.random() * animations.length);

    animations[randomIndex]();
  }

  private prepareInitialSvg() {
    const { arrows, arrowsAll, musicWavesAll, musicWaves } = this.svgElements;

    gsap.set(arrows, { autoAlpha: 0 });
    gsap.set(arrowsAll, { autoAlpha: 1 });
    gsap.set(musicWavesAll, { autoAlpha: 1 });
    gsap.set(musicWaves, { autoAlpha: 0 });
  }

  private initialAnimation() {
    this.isAnimated.set(true);

    const timeline = gsap.timeline({
      onComplete: () => {
        this.isAnimated.set(false);
      },
    });

    const { oSecondLetter, heart } = this.svgElements;

    this.musicWavesAnimation(timeline);
    beatAnimation(timeline, oSecondLetter, heart);
  }

  private musicWavesAnimation(timeline: gsap.core.Timeline) {
    const { letters, musicWaves } = this.svgElements;
    this.isAnimated.set(true);

    fadeOut(timeline, letters);
    musicWaveAnimation(timeline, musicWaves);
    fadeIn(timeline, letters);
  }
}
