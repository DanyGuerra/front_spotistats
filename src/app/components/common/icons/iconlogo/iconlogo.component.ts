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
  @ViewChild('tFirstLetter', { static: true })
  firstLetter!: ElementRef<SVGSVGElement>;

  @ViewChild('appLogo', { static: true })
  appLogo!: ElementRef<SVGSVGElement>;

  @ViewChild('firstArrow', { static: true })
  firstArrow!: ElementRef<SVGSVGElement>;

  isAnimated = signal(false);

  ngAfterViewInit(): void {
    this.animationEachLetter();
  }

  onHover() {
    if (this.isAnimated() === true) return;
    this.isAnimated.set(true);

    this.letterAnimation(this.firstLetter, this.firstArrow);
  }

  private animationEachLetter() {
    const timeline = gsap.timeline();

    this.isAnimated.set(true);

    const letters = this.appLogo.nativeElement.querySelectorAll('#words path');
    const tLetters = this.appLogo.nativeElement.querySelectorAll('.tLetter');
    const arrows = this.appLogo.nativeElement.querySelectorAll('.arrow');

    timeline.set(letters, { y: -50 });
    timeline.set(arrows, { y: 50 });

    letters.forEach((letter, index) => {
      timeline.to(
        letter,
        {
          y: 0,
          duration: 2,
          ease: 'bounce.out',
        },
        index * 0.1
      );
    });

    timeline.to(
      tLetters,
      {
        y: 50,
        ease: 'elastic.in',
        duration: 1,
      },
      '+=1'
    );

    timeline.to(arrows, {
      y: 0,
      duration: 0.5,
      ease: 'elastic.out',
    });

    timeline.to(
      arrows,
      {
        y: 50,
        duration: 0.5,
        ease: 'elastic.in',
      },
      '+=1'
    );

    timeline.to(tLetters, {
      y: 0,
      duration: 0.5,
      ease: 'elastic.out',
      onComplete: () => {
        this.isAnimated.set(false);
      },
    });
  }

  private letterAnimation(
    letter: ElementRef<SVGSVGElement>,
    arrow: ElementRef<SVGSVGElement>
  ) {
    gsap
      .timeline()
      .to(letter.nativeElement, {
        duration: 0.25,
        y: -50,
        ease: 'elastic.in',
      })
      .to(arrow.nativeElement, {
        duration: 1,
        y: 0,
        ease: 'elastic.out',
      })
      .to(arrow.nativeElement, {
        duration: 1,
        y: 50,
        ease: 'elastic.in',
      })
      .to(letter.nativeElement, {
        duration: 0.25,
        y: 0,
        ease: 'elastic.out',
        onComplete: () => {
          this.isAnimated.set(false);
        },
      });
  }
}
