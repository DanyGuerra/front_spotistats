import {
  Component,
  ElementRef,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { IconTrackComponent } from '../icons/icon-track/icon-track.component';
import { IconArtistComponent } from '../icons/icon-artist/icon-artist.component';
import { IconReplayComponent } from '../icons/icon-replay/icon-replay.component';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { NebulaComponent } from '../icons/nebula/nebula.component';
import { CardTopHomeComponent } from '../card-top-home/card-top-home.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LocalStorage } from 'src/constants/localStorage';
import { IUserInfoStored } from 'src/app/interfaces/IUserInfoStored';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';
import { Subscription } from 'rxjs';
import { ToastTranslation } from 'src/app/interfaces/ILanguageTranslation';
gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-home-content',
  standalone: true,
  imports: [
    IconTrackComponent,
    IconArtistComponent,
    IconReplayComponent,
    NebulaComponent,
    CardTopHomeComponent,
    TranslateModule,
  ],
  templateUrl: './home-content.component.html',
  styleUrl: './home-content.component.less',
})
export class HomeContentComponent {
  @ViewChild('constellationContainer', { static: true })
  constellation!: ElementRef;
  @ViewChildren('card', { read: ElementRef }) cards!: QueryList<ElementRef>;
  @ViewChild('nebula', { static: true })
  nebula!: ElementRef;
  @ViewChild('nebula', { static: true })
  nebulaContainer!: ElementRef;
  userData!: IUserInfoStored | null;

  constructor(private router: Router, private authService: AuthService) {}

  get domElements() {
    const constellationElement = this.constellation?.nativeElement;
    return {
      constellationSvg:
        constellationElement?.querySelector('#constellationSvg')!,
      lines: constellationElement?.querySelectorAll('.link')!,
      nodes: constellationElement?.querySelectorAll('.node')!,
    };
  }

  ngOnInit() {
    const storedUser = localStorage.getItem(LocalStorage.UserInfo);
    this.userData = storedUser ? JSON.parse(storedUser) : null;
  }

  ngAfterViewInit() {
    this.scrollTriggerCard();
    this.scrollTriggerNebula();
  }

  handleClick(url: string) {
    const userId = this.userData?.userId;

    if (userId) {
      this.navigateTo(`${userId}/${url}`);
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

  private scrollTriggerCard() {
    this.cards.forEach((card, index) => {
      gsap.from(card.nativeElement, {
        scrollTrigger: {
          trigger: card.nativeElement,
          start: 'top 50%',
          end: 'top 50%',
          toggleActions: 'play none none none',
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        delay: index * 0.1,
      });
    });
  }

  private scrollTriggerNebula() {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: this.nebula.nativeElement,
        scrub: 1,
        start: 'top top',
        endTrigger: this.nebulaContainer.nativeElement,
        end: 'bottom top',
        pin: true,
      },
    });

    tl.to(this.nebula.nativeElement, {
      y: 400,
    });
  }
}
