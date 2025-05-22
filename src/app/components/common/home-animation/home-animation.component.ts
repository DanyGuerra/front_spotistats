import { Component, ElementRef, ViewChild } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SpotifyIconComponent } from '../icons/icon-spotify/icon-spotify.component';
import { IconArrowComponent } from '../icons/icon-arrow/icon-arrow.component';
import { IconAsteriskComponent } from '../icons/icon-asterisk/icon-asterisk.component';
import { IconHeartComponent } from '../icons/icon-heart/icon-heart.component';
import {
  beatAnimation,
  fadeIn,
  fadeOut,
  flipAnimation,
  spinAnimation,
  verticalAnimation,
} from 'src/utils/animations-utils';

import gsap from 'gsap';

@Component({
  selector: 'app-home-animation',
  standalone: true,
  imports: [
    SpotifyIconComponent,
    TranslateModule,
    IconArrowComponent,
    IconAsteriskComponent,
    IconHeartComponent,
  ],
  templateUrl: './home-animation.component.html',
  styleUrl: './home-animation.component.less',
})
export class HomeAnimationComponent {
  @ViewChild('homeHeaderText', { static: false }) homeHeaderText!: ElementRef;

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
    };
  }

  ngAfterViewInit() {
    this.initialAnimation();
  }

  private initialAnimation() {
    const {
      chars,
      iconArrow,
      arrowT,
      oHeart,
      iconHeart,
      backAsterisk,
      iconAsterisk,
    } = this.domElements;
    const timeLine = gsap.timeline();
    const infiniteTimeLine = gsap.timeline({
      repeat: -1,
      delay: 2,
      repeatDelay: 2,
    });
    const timeLine2 = gsap.timeline();
    const timeLine3 = gsap.timeline();

    console.log(backAsterisk);

    this.fadeInChars(timeLine, chars);
    flipAnimation(infiniteTimeLine, arrowT, iconArrow);
    beatAnimation(timeLine2, oHeart, iconHeart, '3');
    beatAnimation(timeLine2, oHeart, iconHeart);
    beatAnimation(timeLine2, oHeart, iconHeart);
    verticalAnimation(timeLine3, backAsterisk, iconAsterisk);
  }

  private fadeInChars(timeLine: gsap.core.Timeline, elements: NodeList) {
    timeLine.from(elements, {
      yPercent: 'random([-100,100])',
      rotation: 'random(-30,30)',
      duration: 1,
      autoAlpha: 0,
      stagger: {
        amount: 1,
        from: 'random',
      },
    });
  }
}
