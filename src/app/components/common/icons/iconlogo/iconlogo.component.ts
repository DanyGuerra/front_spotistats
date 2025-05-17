import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  signal,
} from '@angular/core';
import gsap from 'gsap';

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
    this.initalAnimation();
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
      () => this.verticalAnimation(timeline, firstLetter, firstArrow),
      () => this.verticalAnimation(timeline, secondLetter, secondArrow),
      () => this.verticalAnimation(timeline, thirdLetter, thirdArrow),
      () => this.beatAnimation(timeline, oSecondLetter, heart),
      () => this.verticalAnimation(timeline, tLetters, arrows),
      () => this.spinAnimation(timeline, aSixthLetter, asterisk),
      () => {
        this.musicWavesAnimation(timeline);
        this.beatAnimation(timeline, oSecondLetter, heart);
      },
    ];

    const randomIndex = Math.floor(Math.random() * animations.length);

    animations[randomIndex]();
  }

  private prepareInitialSvg() {
    const { arrows, arrowsAll, musicWavesAll, musicWaves } = this.svgElements;

    gsap.set(arrows, { y: 50 });
    gsap.set(arrowsAll, { autoAlpha: 1 });
    gsap.set(musicWavesAll, { autoAlpha: 1 });
    gsap.set(musicWaves, { autoAlpha: 0 });
  }

  private initalAnimation() {
    this.isAnimated.set(true);

    const timeline = gsap.timeline({
      onComplete: () => {
        this.isAnimated.set(false);
      },
    });

    const { letters, oSecondLetter, heart } = this.svgElements;

    timeline.set(letters, { y: 0 });
    timeline.add(() => {}, 1);
    this.musicWavesAnimation(timeline);
    this.beatAnimation(timeline, oSecondLetter, heart);
  }

  private verticalAnimation(
    timeline: gsap.core.Timeline,
    initialElement: SVGPathElement | NodeList,
    finalElement: SVGPathElement | NodeList
  ) {
    this.fadeOut(timeline, initialElement);
    this.fadeIn(timeline, finalElement);
    this.fadeOut(timeline, finalElement);
    this.fadeIn(timeline, initialElement);
  }

  private beatAnimation(
    timeline: gsap.core.Timeline,
    initialElement: SVGPathElement | NodeList,
    finalElement: SVGPathElement | NodeList
  ) {
    timeline
      .fromTo(
        initialElement,
        { scale: 1, autoAlpha: 1, transformOrigin: '50% 50%' },
        {
          duration: 0.25,
          scale: 0.1,
          autoAlpha: 0,
          ease: 'elastic.in',
        }
      )
      .fromTo(
        finalElement,
        { scale: 0, autoAlpha: 0, transformOrigin: '50% 50%' },
        {
          duration: 1,
          autoAlpha: 1,
          scale: 1.1,
          ease: 'elastic.out',
        }
      )
      .to(finalElement, {
        duration: 0.5,
        scale: 0.5,
        ease: 'elastic.in',
      })
      .to(finalElement, {
        duration: 0.5,
        scale: 1.1,
        ease: 'elastic.out',
      })
      .to(finalElement, {
        duration: 1,
        scale: 0,
        autoAlpha: 0,
        ease: 'elastic.in',
      })
      .to(initialElement, {
        duration: 0.25,
        autoAlpha: 1,
        scale: 1,
        ease: 'elastic.out',
      });
  }

  private spinAnimation(
    timeline: gsap.core.Timeline,
    initialElement: SVGPathElement,
    finalElement: SVGPathElement
  ) {
    timeline
      .fromTo(
        initialElement,
        { autoAlpha: 1, transformOrigin: '50% 50%' },
        {
          rotate: 360,
          duration: 0.5,
          scale: 0,
          autoAlpha: 0,
          ease: 'elastic.in',
        }
      )
      .fromTo(
        finalElement,
        { autoAlpha: 0, transformOrigin: '50% 50%' },
        {
          rotate: 360,
          duration: 1,
          autoAlpha: 1,
          scale: 1.2,
          ease: 'elastic.out',
        }
      )
      .to(finalElement, {
        rotate: -360,
        duration: 1,
        scale: 0,
        autoAlpha: 0,
        ease: 'elastic.in',
      })
      .to(initialElement, {
        rotate: -360,
        duration: 1,
        autoAlpha: 1,
        scale: 1,
        ease: 'elastic.out',
      });
  }

  private fadeOut(
    timeline: gsap.core.Timeline,
    element: SVGPathElement | NodeList
  ) {
    timeline.fromTo(
      element,
      {
        autoAlpha: 1,
      },
      {
        y: 50,
        duration: 1,
        ease: 'elastic.in',
        stagger: {
          each: 0.025,
        },
      }
    );
  }

  private fadeIn(
    timeline: gsap.core.Timeline,
    element: SVGPathElement | NodeList
  ) {
    timeline.to(element, {
      duration: 1,
      y: 0,
      ease: 'elastic.out',
      stagger: {
        each: 0.025,
      },
    });
  }

  private musicWaveAnimation(timeline: gsap.core.Timeline, elements: NodeList) {
    timeline
      .fromTo(
        elements,
        {
          scaleY: 0,
          autoAlpha: 1,
          transformOrigin: 'bottom',
        },
        {
          scaleY: () => gsap.utils.random(0.15, 3),
          repeat: 3,
          yoyo: true,
          duration: 0.25,
          stagger: {
            each: 0.1,
            repeat: 3,
            yoyo: true,
          },
          ease: 'sine.inOut',
        }
      )
      .to(elements, {
        scaleY: 0,
        autoAlpha: 0,
      });
  }

  private musicWavesAnimation(timeline: gsap.core.Timeline) {
    const { letters, musicWaves } = this.svgElements;
    this.isAnimated.set(true);

    this.fadeOut(timeline, letters);
    this.musicWaveAnimation(timeline, musicWaves);
    this.fadeIn(timeline, letters);
  }
}
