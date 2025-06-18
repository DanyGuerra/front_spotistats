import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  Renderer2,
} from '@angular/core';
import gsap from 'gsap';

@Component({
  selector: 'app-ripple-button',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './ripple-button.component.html',
  styleUrls: ['./ripple-button.component.less'],
})
export class RippleButtonComponent {
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() type: 'primary' | 'secondary' = 'primary';
  @Output() onClick = new EventEmitter<void>();

  private ripple: HTMLElement | null = null;
  private timeline: gsap.core.Timeline | null = null;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  handleClick() {
    this.onClick.emit();
  }

  @HostListener('mouseenter', ['$event'])
  onMouseEnter(event: MouseEvent) {
    const button = this.el.nativeElement.querySelector('.ripple-btn');
    const text = this.el.nativeElement.querySelector('.ripple-btn span');

    if (!this.ripple) {
      this.ripple = this.renderer.createElement('div');
      this.renderer.addClass(this.ripple, 'ripple');
      this.renderer.appendChild(button, this.ripple);

      this.moveRipple(event);

      if (this.timeline) {
        this.timeline.kill();
      }

      this.timeline = gsap.timeline();

      this.timeline.to(
        this.ripple,
        {
          scale: 1.8,
          duration: 0.5,
          ease: 'power2.out',
        },
        0
      );

      this.timeline.to(
        text,
        {
          color: `${this.type === 'primary' ? '#fff' : '#000'}`,
          duration: 0.5,
          ease: 'power2.out',
        },
        0
      );
    }
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.moveRipple(event);
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    const button = this.el.nativeElement.querySelector('.ripple-btn');
    const text = this.el.nativeElement.querySelector('.ripple-btn span');

    if (this.timeline) {
      this.timeline.kill();
      this.timeline = null;
    }

    gsap.to(text, {
      color: `${this.type === 'primary' ? '#000' : '#fff'}`,
      duration: 0.3,
      ease: 'power2.out',
    });

    if (this.ripple) {
      gsap.to(this.ripple, {
        scale: 0,
        duration: 0.3,
        onComplete: () => {
          if (this.ripple && button.contains(this.ripple)) {
            this.renderer.removeChild(button, this.ripple);
          }
          this.ripple = null;
        },
      });
    }
  }

  private moveRipple(event: MouseEvent) {
    if (this.ripple) {
      const button = this.el.nativeElement.querySelector('.ripple-btn');
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left - 100;
      const y = event.clientY - rect.top - 100;

      this.renderer.setStyle(this.ripple, 'left', `${x}px`);
      this.renderer.setStyle(this.ripple, 'top', `${y}px`);
    }
  }
}
