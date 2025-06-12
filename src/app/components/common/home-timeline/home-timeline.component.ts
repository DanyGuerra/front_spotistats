import { Component, ViewChild, ElementRef } from '@angular/core';
import { TimelineSvgComponent } from '../icons/timeline-svg/timeline-svg.component';
import { TranslateModule } from '@ngx-translate/core';
import gsap from 'gsap';
import { IconHeartComponent } from '../icons/icon-heart/icon-heart.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-timeline',
  standalone: true,
  imports: [
    TimelineSvgComponent,
    TranslateModule,
    IconHeartComponent,
    CommonModule,
  ],
  templateUrl: './home-timeline.component.html',
  styleUrl: './home-timeline.component.less',
})
export class HomeTimelineComponent {
  @ViewChild('timelineSection', { static: true, read: ElementRef })
  timelineSection!: ElementRef;
  hearts = [
    {
      speed: 1.75,
      direction: 'ccw',
      width: '24px',
      height: '24px',
      top: '20%',
      left: '5%',
    },
    { speed: 1.75, width: '24px', height: '24px', top: '20%', right: '5%' },
    {
      speed: 0.1,
      direction: 'ccw',
      width: '20px',
      height: '20px',
      top: '30%',
      left: '20%',
      dimmed: true,
    },
    {
      speed: 0.1,
      direction: 'ccw',
      width: '20px',
      height: '20px',
      top: '30%',
      right: '20%',
      dimmed: true,
    },
    { speed: 1.5, width: '24px', height: '24px', top: '40%', left: '10%' },
    {
      speed: 1.5,
      direction: 'ccw',
      width: '24px',
      height: '24px',
      top: '40%',
      right: '10%',
    },
    {
      speed: 0.3,
      width: '20px',
      height: '20px',
      top: '50%',
      left: '25%',
      dimmed: true,
    },
    {
      speed: 0.3,
      width: '20px',
      height: '20px',
      top: '50%',
      right: '25%',
      dimmed: true,
    },
    {
      speed: 1.5,
      direction: 'ccw',
      width: '18px',
      height: '24px',
      top: '60%',
      left: '15%',
    },
    {
      speed: 1.5,
      width: '24px',
      height: '24px',
      top: '60%',
      right: '15%',
    },
    {
      speed: 0.5,
      direction: 'ccw',
      width: '24px',
      height: '24px',
      top: '70%',
      left: '5%',
      dimmed: true,
    },
    {
      speed: 0.5,
      width: '24px',
      height: '24px',
      top: '70%',
      right: '5%',
      dimmed: true,
    },
    {
      speed: 1.1,
      direction: 'ccw',
      width: '24px',
      height: '24px',
      top: '80%',
      left: '10%',
    },
    {
      speed: 1.1,
      width: '24px',
      height: '24px',
      top: '80%',
      right: '10%',
    },
    {
      speed: 1.5,
      width: '24px',
      height: '24px',
      top: '90%',
      left: '20%',
      dimmed: true,
    },
    {
      speed: 1.5,
      direction: 'ccw',
      width: '24px',
      height: '24px',
      top: '90%',
      right: '20%',
      dimmed: true,
    },
    {
      speed: 1,
      direction: 'ccw',
      width: '24px',
      height: '24px',
      top: '100%',
      left: '14%',
    },
    { speed: 1, width: '24px', height: '24px', top: '100%', right: '14%' },
  ];

  get domElements() {
    const section = this.timelineSection?.nativeElement;
    return {
      allSection: section,
      textTimeline: section?.querySelector('#textTimelineSection'),
      timelineSvg: section?.querySelector('#timelineSvg svg'),
      nodeGuideSvg: section?.querySelector('#timelineSvg svg .nodeGuide'),
      mainPath: section?.querySelector('#timelineSvg svg #mainPath'),
      nodesSvg: section?.querySelectorAll('#timelineSvg svg .nodeLine'),
      textSvg: section?.querySelectorAll('#timelineSvg svg .text'),
      heartsIcons: section?.querySelectorAll('.heart'),
    };
  }

  ngAfterViewInit() {
    this.scrollTriggerText();
    this.scrollDrawPath();
    this.scrollHearts();
  }

  private scrollTriggerText() {
    const textScroll = gsap.timeline({
      scrollTrigger: {
        trigger: this.domElements.allSection,
        start: 'top 50%',
        end: 'top 50%',
        toggleActions: 'play none none none',
      },
    });

    textScroll.from(this.domElements.textTimeline, {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: 'power2.out',
    });
  }

  private scrollDrawPath() {
    const { nodesSvg, textSvg, timelineSvg, mainPath, nodeGuideSvg } =
      this.domElements;
    const [firstNode, secondNode, thirdNode] = nodesSvg;
    const [firstText, secondText, thirdText] = textSvg;

    const textPulses = gsap
      .timeline({
        defaults: {
          duration: 0.05,
          autoAlpha: 1,
          scale: 1.05,
          transformOrigin: 'center',
          ease: 'elastic(2.5, 1)',
        },
      })
      .to(firstText, {}, 0.135)
      .to(secondText, {}, 0.29)
      .to(thirdText, {}, 0.505);

    const pulses = gsap
      .timeline({
        defaults: {
          duration: 0.05,
          autoAlpha: 1,
          scale: 1.5,
          transformOrigin: 'center',
          ease: 'elastic(2.5, 1)',
        },
      })
      .to(firstNode, {}, 0.135)
      .to(secondNode, {}, 0.29)
      .to(thirdNode, {}, 0.505)
      .add(textPulses, 0);

    gsap
      .timeline({
        defaults: { duration: 1 },
        scrollTrigger: {
          trigger: timelineSvg,
          scrub: true,
          start: 'top center',
          end: 'bottom center',
        },
      })
      .to(nodeGuideSvg, { duration: 0.01, autoAlpha: 1 })
      .from(mainPath, { drawSVG: 0 }, 0)
      .to(
        nodeGuideSvg,
        {
          motionPath: {
            path: mainPath,
            align: mainPath,
            alignOrigin: [0.5, 0.5],
          },
        },
        0
      )
      .add(pulses, 0);
  }

  private scrollHearts() {
    const { heartsIcons, timelineSvg } = this.domElements;

    heartsIcons.forEach((heart: Element) => {
      const speed = parseFloat(heart.getAttribute('data-speed') || '1');
      const attrRotation = heart.getAttribute('direction-rotation');
      const rotation = attrRotation === 'ccw' ? -1 : 1;

      gsap.to(heart, {
        scrollTrigger: {
          trigger: timelineSvg,
          scrub: true,
          start: 'top center',
          end: 'bottom center',
        },
        y: -100 * speed,
        duration: 1,
        rotate: 180 * rotation,
      });
    });
  }
}
