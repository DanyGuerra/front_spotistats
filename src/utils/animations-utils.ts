import gsap from 'gsap';

export function beatAnimation(
  timeline: gsap.core.Timeline,
  initialElement: SVGPathElement | HTMLElement | NodeList,
  finalElement: SVGPathElement | HTMLElement | NodeList,
  position: gsap.Position = '>'
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
      },
      position
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
      delay: 1,
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
      delay: 1,
    })
    .to(initialElement, {
      duration: 0.25,
      autoAlpha: 1,
      scale: 1,
      ease: 'elastic.out',
    });
}

export function flipAnimation(
  timeline: gsap.core.Timeline,
  initialElement: HTMLElement,
  finalElement: HTMLElement,
  position: gsap.Position = '>'
) {
  timeline.set(initialElement, { rotateX: 0, autoAlpha: 1 }, position);
  timeline.set(finalElement, { rotateX: 90, autoAlpha: 1 }, position);

  timeline
    .to(
      initialElement,
      {
        rotateX: 270,
        duration: 0.5,
        autoAlpha: 1,
      },
      position
    )
    .to(
      finalElement,
      {
        rotateX: 0,
        duration: 0.75,
        autoAlpha: 1,
      },
      '>'
    )
    .to(finalElement, {
      duration: 0.5,
      rotateX: 270,
      delay: 2,
    })
    .to(initialElement, {
      duration: 1,
      rotateX: 0,
      autoAlpha: 1,
    });
}

export function spinAnimation(
  timeline: gsap.core.Timeline,
  initialElement: SVGPathElement,
  finalElement: SVGPathElement,
  position: gsap.Position = '>'
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
      },
      position
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

export function fadeOut(
  timeline: gsap.core.Timeline,
  element: HTMLElement | SVGPathElement | NodeList,
  position: gsap.Position = '>'
) {
  timeline.fromTo(
    element,
    {
      y: 0,
    },
    {
      y: 50,
      autoAlpha: 0,
      ease: 'elastic.in',
      duration: 1.5,
      stagger: {
        each: 0.025,
      },
    },
    position
  );
}

export function fadeIn(
  timeline: gsap.core.Timeline,
  element: SVGPathElement | NodeList,
  position: gsap.Position = '>'
) {
  timeline.fromTo(
    element,
    {
      y: 50,
    },
    {
      y: 0,
      autoAlpha: 1,
      duration: 1.5,
      ease: 'elastic.out',
      stagger: {
        each: 0.05,
      },
    },
    position
  );
}

export function verticalAnimation(
  timeline: gsap.core.Timeline,
  initialElement: SVGPathElement | NodeList,
  finalElement: SVGPathElement | NodeList,
  position: gsap.Position = '>'
) {
  fadeOut(timeline, initialElement, position);
  fadeIn(timeline, finalElement);
  fadeOut(timeline, finalElement);
  fadeIn(timeline, initialElement);
}

export function animateVerticalShift(
  timeline: gsap.core.Timeline,
  initialElement: HTMLElement | SVGPathElement | NodeList,
  finalElement: HTMLElement | SVGPathElement | NodeList,
  postition: gsap.Position = '>'
) {
  timeline
    .to(
      initialElement,
      {
        y: 50,
        duration: 0.3,
        autoAlpha: 0,
        ease: 'power1.out',
      },
      postition
    )
    .fromTo(
      finalElement,
      { y: -50, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 0.3,
        ease: 'power1.out',
      },
      '-=0.3'
    )
    .to(initialElement, { y: 0, autoAlpha: 1, duration: 0.3 }, 10)
    .to(finalElement, { y: -50, autoAlpha: 0, duration: 0.3 }, '-=0.3');
}

export function musicWaveAnimation(
  timeline: gsap.core.Timeline,
  elements: NodeList,
  position: gsap.Position = '>'
) {
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
        repeat: 1,
        yoyo: true,
        duration: 0.25,
        stagger: {
          each: 0.1,
          repeat: 3,
          yoyo: true,
        },
        ease: 'sine.inOut',
      },
      position
    )
    .to(elements, {
      scaleY: 0,
      autoAlpha: 0,
    });
}
