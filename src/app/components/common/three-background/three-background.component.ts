import { Component, ElementRef, OnInit, OnDestroy, ViewChild, AfterViewInit, NgZone } from '@angular/core';
import * as THREE from 'three';

@Component({
  standalone: true,
  selector: 'app-three-background',
  templateUrl: './three-background.component.html',
  styleUrls: ['./three-background.component.less'],
})
export class ThreeBackgroundComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('rendererContainer', { static: true }) rendererContainer!: ElementRef<HTMLDivElement>;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private animationFrameId: number | null = null;
  private intersectionObserver!: IntersectionObserver;
  private isVisible = true;
  private lastWidth = window.innerWidth;
  
  // Lightweight Particle System
  private particles!: THREE.Points;
  private mouse = new THREE.Vector2(0, 0); 
  private targetMouse = new THREE.Vector2(0, 0);

  constructor(private ngZone: NgZone) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initThreeJs();
    this.animate();
    
    window.addEventListener('resize', this.onWindowResize);
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('scroll', this.onScroll);
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.onWindowResize);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('scroll', this.onScroll);

    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }

    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.forceContextLoss();
    }
    
    if (this.scene) {
      this.scene.clear();
      if(this.particles) {
         this.particles.geometry.dispose();
         if (Array.isArray(this.particles.material)) {
             this.particles.material.forEach(m => m.dispose());
         } else {
             this.particles.material.dispose();
         }
      }
    }
  }

  private initThreeJs(): void {
    const container = this.rendererContainer.nativeElement;
    const isMobile = window.innerWidth < 768;
    
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x0A0A0A, 0.0015);

    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 2000);
    this.camera.position.z = isMobile ? 600 : 400;

    // Use low-power for max mobile battery saving and disable antialias (particles don't need it)
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'low-power' }); 
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(this.renderer.domElement);

    // Create a very lightweight particle system (stars/dust effect)
    const particleCount = isMobile ? 300 : 1200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i++) {
        // Random positions inside a large 3D volume
        positions[i] = (Math.random() - 0.5) * 1500; // x, y, z
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    // Computational circular texture (faster than loading an external PNG)
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const context = canvas.getContext('2d')!;
    const gradient = context.createRadialGradient(8, 8, 0, 8, 8, 8);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 16, 16);
    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
        size: isMobile ? 6 : 4,
        color: 0x1DB954, // Signature Spotify Green
        map: texture,
        transparent: true,
        opacity: 0.8,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  private animate(): void {
    this.ngZone.runOutsideAngular(() => {
      const renderLoop = () => {
        this.animationFrameId = requestAnimationFrame(renderLoop);

        // Pause entirely if scrolled out of view to guarantee 100% smooth GSAP animations below
        if (!this.isVisible) return; 

        // Smoothly interpolate mouse target (only subtle effect)
        this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.05;
        this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.05;

        // Extremely cheap animation: Rotate the entire geometry once (1 call) instead of 900+ blocks
        this.particles.rotation.y += 0.0005;
        this.particles.rotation.x += 0.0002;

        // Subtle parallax camera movement
        this.camera.position.x += (this.mouse.x * 50 - this.camera.position.x) * 0.05;
        this.camera.position.y += (-this.mouse.y * 50 - this.camera.position.y) * 0.05;
        this.camera.lookAt(this.scene.position);

        this.renderer.render(this.scene, this.camera);
      };
      
      this.animationFrameId = requestAnimationFrame(renderLoop);
    });
  }

  private onWindowResize = (): void => {
    // Prevent the collapsing address bar on mobile from triggering heavy WebGL re-allocations during scroll
    if (window.innerWidth < 768 && window.innerWidth === this.lastWidth) return;
    this.lastWidth = window.innerWidth;

    if(!this.camera || !this.renderer) return;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  }

  private onMouseMove = (event: MouseEvent): void => {
    // Normalize coordinates for camera parallax offset
    this.targetMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.targetMouse.y = (event.clientY / window.innerHeight) * 2 - 1;
  }

  private onScroll = (): void => {
    // True optimization: stop rendering once scrolled past the hero section
    // Using 1.5x windowHeight to provide a safe buffer
    this.isVisible = window.scrollY < window.innerHeight * 1.5;
  }
}
