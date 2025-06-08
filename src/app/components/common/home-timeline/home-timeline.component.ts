import { Component, ViewChild, ElementRef } from '@angular/core';
import { TimelineSvgComponent } from '../icons/timeline-svg/timeline-svg.component';
import gsap from 'gsap';
import { add } from 'date-fns';

@Component({
  selector: 'app-home-timeline',
  standalone: true,
  imports: [TimelineSvgComponent],
  templateUrl: './home-timeline.component.html',
  styleUrl: './home-timeline.component.less',
})
export class HomeTimelineComponent {
  @ViewChild('timelineSection', { static: true, read: ElementRef })
  timelineSection!: ElementRef;

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
    };
  }

  ngAfterViewInit() {
    this.scrollTrigger();
    this.scrollDrawPath();
    console.log(this.domElements);
  }

  private scrollTrigger() {
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
    const { nodesSvg, textSvg } = this.domElements;
    const [firstNode, secondNode, thirdNode] = nodesSvg;
    const [firstText, secondText, thirdText] = textSvg;

    const textPulses = gsap
      .timeline({
        defaults: {
          duration: 0.05,
          autoAlpha: 1,
          transformOrigin: 'center',
          ease: 'elastic(2.5, 1)',
        },
      })
      .to(firstText, {}, 0.13)
      .to(secondText, {}, 0.3)
      .to(thirdText, {}, 0.5);

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
      .to(firstNode, {}, 0.13)
      .to(secondNode, {}, 0.3)
      .to(thirdNode, {}, 0.5)
      .add(textPulses, 0);

    gsap
      .timeline({
        defaults: { duration: 1 },
        scrollTrigger: {
          trigger: this.domElements.timelineSvg,
          scrub: true,
          start: 'top center',
          end: 'bottom center',
        },
      })
      .to(this.domElements.nodeGuideSvg, { duration: 0.01, autoAlpha: 1 })
      .from(this.domElements.mainPath, { drawSVG: 0 }, 0)
      .to(
        this.domElements.nodeGuideSvg,
        {
          motionPath: {
            path: this.domElements.mainPath,
            align: this.domElements.mainPath,
            alignOrigin: [0.5, 0.5],
          },
        },
        0
      )
      .add(pulses, 0);
  }
}
