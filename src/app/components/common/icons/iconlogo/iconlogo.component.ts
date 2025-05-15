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
      heart: svg?.querySelector<SVGPathElement>('#heart')!,
      arrowsTogether: svg?.querySelector<SVGPathElement>('#arrows')!,
      letters: svg?.querySelectorAll<SVGPathElement>('#words path') ?? [],
      tLetters: svg?.querySelectorAll<SVGPathElement>('.tLetter') ?? [],
      arrows: svg?.querySelectorAll<SVGPathElement>('.arrow') ?? [],
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
    } = this.svgElements;

    const animations = [
      () => this.verticalAnimation(firstLetter, firstArrow),
      () => this.verticalAnimation(secondLetter, secondArrow),
      () => this.verticalAnimation(thirdLetter, thirdArrow),
      () => this.beatAnimation(oSecondLetter, heart),
      () => this.verticalAnimation(tLetters, arrows),
    ];

    const randomIndex = Math.floor(Math.random() * animations.length);

    animations[randomIndex]();
  }

  private prepareInitialSvg() {
    const { letters, arrows, arrowsTogether, heart } = this.svgElements;

    gsap.set(letters, { y: -50 });
    gsap.set(arrows, { y: 50 });
    gsap.set(arrowsTogether, { autoAlpha: 1 });
  }

  private initalAnimation() {
    const timeline = gsap.timeline();
    this.isAnimated.set(true);

    const { letters, firstLetter, firstArrow } = this.svgElements;

    letters.forEach((letter, index) => {
      timeline.to(
        letter,
        {
          y: 0,
          duration: 1,
          ease: 'bounce.out',
        },
        index * 0.05
      );
    });

    timeline.to(firstLetter, {
      y: 50,
      ease: 'elastic.in',
      duration: 1,
    });

    timeline.to(firstArrow, {
      y: 0,
      duration: 0.5,
      ease: 'elastic.out',
    });

    timeline.to(
      firstArrow,
      {
        y: 50,
        duration: 0.5,
        ease: 'elastic.in',
      },
      '+=1'
    );

    timeline.to(firstLetter, {
      y: 0,
      duration: 0.5,
      ease: 'elastic.out',
      onComplete: () => {
        this.isAnimated.set(false);
      },
    });
  }

  private verticalAnimation(
    initialElement: SVGPathElement | NodeList,
    finalElement: SVGPathElement | NodeList
  ) {
    gsap
      .timeline()
      .to(initialElement, {
        duration: 0.25,
        y: -50,
        ease: 'elastic.in',
      })
      .to(finalElement, {
        duration: 1,
        y: 0,
        ease: 'elastic.out',
      })
      .to(finalElement, {
        duration: 1,
        y: 50,
        ease: 'elastic.in',
      })
      .to(initialElement, {
        duration: 0.25,
        y: 0,
        ease: 'elastic.out',
        onComplete: () => {
          this.isAnimated.set(false);
        },
      });
  }

  private beatAnimation(
    initialElement: SVGPathElement | NodeList,
    finalElement: SVGPathElement | NodeList
  ) {
    gsap.set(initialElement, { autoAlpha: 1, transformOrigin: '50% 50%' });
    gsap.set(finalElement, {
      autoAlpha: 1,
      scale: 0.1,
      transformOrigin: '50% 50%',
    });

    gsap
      .timeline()
      .to(initialElement, {
        duration: 0.25,
        scale: 0.1,
        autoAlpha: 0,
        ease: 'elastic.in',
      })
      .to(finalElement, {
        duration: 1,
        autoAlpha: 1,
        scale: 1.1,
        ease: 'elastic.out',
      })
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
        scale: 0.1,
        autoAlpha: 0,
        ease: 'elastic.in',
      })
      .to(initialElement, {
        duration: 0.25,
        autoAlpha: 1,
        scale: 1,
        ease: 'elastic.out',
        onComplete: () => {
          this.isAnimated.set(false);
        },
      });
  }
}
