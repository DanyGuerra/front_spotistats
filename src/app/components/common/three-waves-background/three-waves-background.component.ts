import { Component, ElementRef, OnInit, OnDestroy, ViewChild, AfterViewInit, NgZone } from '@angular/core';
import * as THREE from 'three';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

@Component({
  standalone: true,
  selector: 'app-three-waves-background',
  templateUrl: './three-waves-background.component.html',
  styleUrls: ['./three-waves-background.component.less'],
})
export class ThreeWavesBackgroundComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('renderCanvas', { static: true }) renderCanvas!: ElementRef<HTMLDivElement>;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private animationFrameId: number | null = null;
  private lastWidth = window.innerWidth;

  private composer!: EffectComposer;

  private particles!: THREE.Points;
  private linesMesh!: THREE.LineSegments;

  private particleCount = 0;
  private maxDistance = 0;

  private positions!: Float32Array;
  private velocities!: THREE.Vector3[];

  private linesPositions!: Float32Array;
  private linesColors!: Float32Array;
  private linesGeometry!: THREE.BufferGeometry;

  private mouseX = 0;
  private mouseY = 0;
  private targetX = 0;
  private targetY = 0;
  private windowHalfX = window.innerWidth / 2;
  private windowHalfY = window.innerHeight / 2;

  constructor(private ngZone: NgZone) { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    if (typeof window !== 'undefined') {
      this.initThreeJs();
      this.animate();

      window.addEventListener('resize', this.onWindowResize);
      window.addEventListener('mousemove', this.onMouseMove);
      window.addEventListener('touchmove', this.onTouchMove, { passive: true });
    }
  }

  ngOnDestroy(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.onWindowResize);
      window.removeEventListener('mousemove', this.onMouseMove);
      window.removeEventListener('touchmove', this.onTouchMove);
    }

    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }

    if (this.composer) {
      this.composer.dispose();
    }
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.forceContextLoss();
    }

    if (this.scene) {
      this.scene.clear();
      if (this.particles) {
        this.particles.geometry.dispose();
        (this.particles.material as THREE.Material).dispose();
      }
      if (this.linesMesh) {
        this.linesMesh.geometry.dispose();
        (this.linesMesh.material as THREE.Material).dispose();
      }
    }
  }

  private initThreeJs(): void {
    const container = this.renderCanvas.nativeElement;
    const isMobile = window.innerWidth < 768;

    this.particleCount = isMobile ? 180 : 350;
    this.maxDistance = isMobile ? 120 : 150;

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x020202, 0.001);

    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 3000);
    this.camera.position.z = isMobile ? 800 : 600;

    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.renderer.toneMapping = THREE.ReinhardToneMapping;
    container.appendChild(this.renderer.domElement);

    // Post-Processing
    const renderScene = new RenderPass(this.scene, this.camera);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.6, // Strength
      0.4, // Radius
      0.2  // Threshold
    );

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(renderScene);
    this.composer.addPass(bloomPass);

    // Nodes Setup
    const particlesGeometry = new THREE.BufferGeometry();
    const particleColors = new Float32Array(this.particleCount * 3);
    const particleSizes = new Float32Array(this.particleCount);

    this.positions = new Float32Array(this.particleCount * 3);
    this.velocities = [];

    const colorSpotify = new THREE.Color(0x1bd760);
    const bounds = 800;

    for (let i = 0; i < this.particleCount; i++) {
      const i3 = i * 3;

      this.positions[i3] = (Math.random() - 0.5) * bounds;
      this.positions[i3 + 1] = (Math.random() - 0.5) * bounds;
      this.positions[i3 + 2] = (Math.random() - 0.5) * bounds;

      this.velocities.push(new THREE.Vector3(
        (Math.random() - 0.5) * 0.3,
        (Math.random() - 0.5) * 0.3,
        (Math.random() - 0.5) * 0.3
      ));

      particleColors[i3] = colorSpotify.r;
      particleColors[i3 + 1] = colorSpotify.g;
      particleColors[i3 + 2] = colorSpotify.b;

      // Size differentiation
      const isBigNode = Math.random() > 0.85;
      particleSizes[i] = isBigNode ? (6 + Math.random() * 4) : (1 + Math.random() * 2);
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3).setUsage(THREE.DynamicDrawUsage));
    particlesGeometry.setAttribute('customColor', new THREE.BufferAttribute(particleColors, 3));
    particlesGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));

    // Custom ShaderMaterial for dynamic node sizing
    const particleShaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: `
            attribute float size;
            attribute vec3 customColor;
            varying vec3 vColor;
            void main() {
                vColor = customColor;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = size * (1000.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
      fragmentShader: `
            varying vec3 vColor;
            void main() {
                vec2 xy = gl_PointCoord.xy - vec2(0.5);
                float ll = length(xy);
                if(ll > 0.5) discard;
                
                float alpha = (0.5 - ll) * 1.2;
                gl_FragColor = vec4(vColor * 0.9, alpha); 
            }
        `,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true
    });

    this.particles = new THREE.Points(particlesGeometry, particleShaderMaterial);
    this.particles.rotation.z = Math.PI / 4;
    this.scene.add(this.particles);

    // Connections (Lines) Setup
    const segmentsMax = (this.particleCount * (this.particleCount - 1)) / 2;
    this.linesPositions = new Float32Array(segmentsMax * 3 * 2);
    this.linesColors = new Float32Array(segmentsMax * 3 * 2);

    this.linesGeometry = new THREE.BufferGeometry();
    this.linesGeometry.setAttribute('position', new THREE.BufferAttribute(this.linesPositions, 3).setUsage(THREE.DynamicDrawUsage));
    this.linesGeometry.setAttribute('color', new THREE.BufferAttribute(this.linesColors, 3).setUsage(THREE.DynamicDrawUsage));

    const linesMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.1,
      depthTest: false
    });

    this.linesMesh = new THREE.LineSegments(this.linesGeometry, linesMaterial);
    this.linesMesh.rotation.z = this.particles.rotation.z;
    this.scene.add(this.linesMesh);
  }

  private animate(): void {
    this.ngZone.runOutsideAngular(() => {
      const renderLoop = () => {
        this.animationFrameId = requestAnimationFrame(renderLoop);

        // Movement mechanics
        const vertexPosAttribute = this.particles.geometry.attributes['position'];

        for (let i = 0; i < this.particleCount; i++) {
          const i3 = i * 3;
          const v = this.velocities[i];

          this.positions[i3] += v.x;
          this.positions[i3 + 1] += v.y;
          this.positions[i3 + 2] += v.z;

          const bound = 400;
          if (this.positions[i3] < -bound || this.positions[i3] > bound) v.x *= -1;
          if (this.positions[i3 + 1] < -bound || this.positions[i3 + 1] > bound) v.y *= -1;
          if (this.positions[i3 + 2] < -bound || this.positions[i3 + 2] > bound) v.z *= -1;
        }

        // Distance collision check 
        let vertexPos = 0;
        let colorPos = 0;
        let lineCount = 0;

        const p1 = new THREE.Vector3();
        const p2 = new THREE.Vector3();

        for (let i = 0; i < this.particleCount; i++) {
          const i3 = i * 3;
          p1.set(this.positions[i3], this.positions[i3 + 1], this.positions[i3 + 2]);

          for (let j = i + 1; j < this.particleCount; j++) {
            const j3 = j * 3;
            p2.set(this.positions[j3], this.positions[j3 + 1], this.positions[j3 + 2]);

            const distSq = p1.distanceToSquared(p2);

            if (distSq < (this.maxDistance * this.maxDistance)) {
              const c1r = this.particles.geometry.attributes['customColor'].getX(i);
              const c1g = this.particles.geometry.attributes['customColor'].getY(i);
              const c1b = this.particles.geometry.attributes['customColor'].getZ(i);

              const c2r = this.particles.geometry.attributes['customColor'].getX(j);
              const c2g = this.particles.geometry.attributes['customColor'].getY(j);
              const c2b = this.particles.geometry.attributes['customColor'].getZ(j);

              const distanceAlpha = 1.0 - (distSq / (this.maxDistance * this.maxDistance));

              this.linesPositions[vertexPos++] = p1.x;
              this.linesPositions[vertexPos++] = p1.y;
              this.linesPositions[vertexPos++] = p1.z;

              this.linesColors[colorPos++] = c1r * distanceAlpha;
              this.linesColors[colorPos++] = c1g * distanceAlpha;
              this.linesColors[colorPos++] = c1b * distanceAlpha;

              this.linesPositions[vertexPos++] = p2.x;
              this.linesPositions[vertexPos++] = p2.y;
              this.linesPositions[vertexPos++] = p2.z;

              this.linesColors[colorPos++] = c2r * distanceAlpha;
              this.linesColors[colorPos++] = c2g * distanceAlpha;
              this.linesColors[colorPos++] = c2b * distanceAlpha;

              lineCount++;
            }
          }
        }

        vertexPosAttribute.needsUpdate = true;
        this.linesGeometry.setDrawRange(0, lineCount * 2);
        this.linesGeometry.attributes['position'].needsUpdate = true;
        this.linesGeometry.attributes['color'].needsUpdate = true;

        // Global rotation
        this.particles.rotation.y += 0.0005;
        this.linesMesh.rotation.y += 0.0005;

        // Camera Parallax
        if (window.innerWidth >= 768) {
          this.camera.position.x += (-this.targetX - this.camera.position.x) * 0.03;
          this.camera.position.y += (this.targetY - this.camera.position.y) * 0.03;
          this.camera.lookAt(this.scene.position);
        }

        // Render via Composer
        this.composer.render();
      };

      this.animationFrameId = requestAnimationFrame(renderLoop);
    });
  }

  private onWindowResize = (): void => {
    if (window.innerWidth < 768 && window.innerWidth === this.lastWidth) return;
    this.lastWidth = window.innerWidth;
    this.windowHalfX = window.innerWidth / 2;
    this.windowHalfY = window.innerHeight / 2;

    if (!this.camera || !this.renderer || !this.composer) return;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    this.composer.setSize(window.innerWidth, window.innerHeight);
  }

  private onMouseMove = (event: MouseEvent): void => {
    this.mouseX = event.clientX - this.windowHalfX;
    this.mouseY = event.clientY - this.windowHalfY;

    this.targetX = this.mouseX * 0.4;
    this.targetY = this.mouseY * 0.4;
  }

  private onTouchMove = (event: TouchEvent): void => {
    if (event.touches.length > 0) {
      this.mouseX = event.touches[0].clientX - this.windowHalfX;
      this.mouseY = event.touches[0].clientY - this.windowHalfY;

      this.targetX = this.mouseX * 0.4;
      this.targetY = this.mouseY * 0.4;
    }
  }
}
