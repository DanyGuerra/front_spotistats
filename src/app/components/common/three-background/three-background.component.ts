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
  
  // User interaction
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2(-1000, -1000); 
  private intersectPoint = new THREE.Vector3();
  private planeForRaycast = new THREE.Plane(new THREE.Vector3(0, 1, 0), 100); 

  // Instanced Mesh for bar graphs (Waves + Stats)
  private instancedMesh!: THREE.InstancedMesh;
  private isMobile = false;
  private cols = 120;
  private rows = 50;
  private spacingX = 22;
  private spacingZ = 22;
  private globalTime = 0;

  // Memory Optimization
  private dummy = new THREE.Object3D();
  private color = new THREE.Color();
  
  // Color Theme: Spotify Musical Waves
  private colorBase = new THREE.Color('#0A0A0A'); // Dark but visible background
  private colorMid = new THREE.Color('#1E1E1E'); // Dim gray for volume
  private colorPrimary = new THREE.Color('#1DB954'); // Vivid Classic Spotify Green
  private colorHighlight = new THREE.Color('#4bd57a'); // Illuminated green for high peaks without blinding the text
  
  constructor(private ngZone: NgZone) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initThreeJs();
    this.animate();

    this.onWindowResize = this.onWindowResize.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    
    window.addEventListener('resize', this.onWindowResize);
    window.addEventListener('mousemove', this.onMouseMove);

    this.intersectionObserver = new IntersectionObserver((entries) => {
      this.isVisible = entries[0].isIntersecting;
    }, { threshold: 0 });
    this.intersectionObserver.observe(this.rendererContainer.nativeElement);
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.onWindowResize);
    window.removeEventListener('mousemove', this.onMouseMove);

    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }

    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.forceContextLoss();
    }
    
    if (this.scene) {
      this.scene.clear();
      if(this.instancedMesh) {
         this.instancedMesh.geometry.dispose();
         (this.instancedMesh.material as THREE.Material).dispose();
      }
    }
  }

  private initThreeJs(): void {
    const container = this.rendererContainer.nativeElement;
    this.isMobile = window.innerWidth < 768;
    
    // Performance optimizations for mobile devices
    this.cols = this.isMobile ? 24 : 120;
    this.rows = this.isMobile ? 16 : 50;
    this.spacingX = this.isMobile ? 66 : 22;
    this.spacingZ = this.isMobile ? 66 : 22;

    this.scene = new THREE.Scene();
    
    // Immersive Fog depth adjusted to a medium balance
    this.scene.fog = new THREE.FogExp2(0x0A0A0A, 0.0012);

    // Camera positioned looking "Downward and to the Horizon" like a data panel
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 4000);
    this.camera.position.set(0, 250, 700);
    this.camera.lookAt(0, -100, 0);

    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' }); 
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.isMobile ? 1 : 2));
    container.appendChild(this.renderer.domElement);

    // Bar Graphs Field Construction (Equalizer)
    const count = this.cols * this.rows;
    // Solid vertical boxes
    const boxSize = this.isMobile ? 33 : 11;
    const geometry = new THREE.BoxGeometry(boxSize, 1, boxSize);
    
    const material = new THREE.MeshBasicMaterial({ 
       color: 0xffffff,
       transparent: true,
       opacity: 0.70 // Perfect 70% balance, doesn't hurt text legibility or fade out your art
    });

    this.instancedMesh = new THREE.InstancedMesh(geometry, material, count);
    this.scene.add(this.instancedMesh);
  }

  private animate(): void {
    this.ngZone.runOutsideAngular(() => {
      const renderLoop = () => {
        this.animationFrameId = requestAnimationFrame(renderLoop);

        // Skip heavy calculations and rendering if scrolled out of view to preserve mobile ScrollTrigger performance
        if (!this.isVisible) return; 

        // Fire the Raycaster to the invisible plane to calculate the exact point under the mouse in 3D
        if (!this.isMobile) {
          this.raycaster.setFromCamera(this.mouse, this.camera);
          this.raycaster.ray.intersectPlane(this.planeForRaycast, this.intersectPoint);
        }

        this.globalTime += 1;
        const time = this.globalTime * 0.008; // Slower time scaling

        let index = 0;

        for (let x = 0; x < this.cols; x++) {
           for (let z = 0; z < this.rows; z++) {
              
              const worldX = (x - this.cols / 2) * this.spacingX;
              const worldZ = (z - this.rows / 2) * this.spacingZ;
              
              // 1. BASE MUSICAL WAVE Multiple Crossed (Lower, relaxing frequencies = "Smooth")
              let waveAmplitude = Math.sin(worldX * 0.006 + time) * 12 
                                + Math.cos(worldZ * 0.008 - time * 0.5) * 12;
              
              // 2. MASTER FREQUENCY (A simulated central audio track from Left to Right)
              const centerDistZ = Math.abs(worldZ);
              if (centerDistZ < 300) {
                  // Closer to the center means higher statistical volume
                  const trackPulse = Math.max(0, 1.0 - (centerDistZ / 300));
                  // Aggressive up and down waveform shape slightly relaxed
                  const eqWave = Math.sin(worldX * 0.02 + time * 2) * Math.cos(worldX * 0.01) * 35;
                  waveAmplitude += trackPulse * eqWave;
              }

              // 3. USER INTERACTION (Cursor raises the statistic and changes its spectrum)
              let hoverInfluence = 0;
              if (this.intersectPoint && !this.isMobile) {
                  const dx = worldX - this.intersectPoint.x;
                  const dz = worldZ - this.intersectPoint.z;
                  const dist = Math.sqrt(dx * dx + dz * dz);

                  // Radius of influence over the data sea
                  if (dist < 280) {
                      hoverInfluence = Math.pow((280 - dist) / 280, 2);
                      // Interactive bounce wave with less aggressive spiking (Visual smoothness)
                      const interactiveSpike = Math.cos(dist * 0.06 - time * 4) * 50;
                      // The user literally shapes topographic peaks
                      waveAmplitude += Math.max(0, interactiveSpike * hoverInfluence);
                  }
              }

              // Establish a healthy minimum height
              const finalHeight = Math.max(2, waveAmplitude + 40);
              
              // Growing upwards from the floor. (y = height / 2 keeps the bottom always at -100)
              this.dummy.position.set(worldX, -150 + finalHeight / 2, worldZ);
              this.dummy.scale.set(1, finalHeight, 1);
              this.dummy.updateMatrix();
              
              this.instancedMesh.setMatrixAt(index, this.dummy.matrix);

              // 4. STATISTICAL TEMPERATURE / COLOR MAPPING
              // Depending on the "Data Volume" (Wave height), we paint the block
              const colorRatio = Math.min(1.0, Math.max(0, finalHeight / 110)); 
              
              // Tricolor Lerp: Dark -> Spotify Green -> Bright White
              if (colorRatio < 0.5) {
                  const localRatio = colorRatio * 2.0; 
                  this.color.copy(this.colorBase).lerp(this.colorPrimary, localRatio);
              } else {
                  const localRatio = (colorRatio - 0.5) * 2.0;
                  this.color.copy(this.colorPrimary).lerp(this.colorHighlight, localRatio);
              }

              // Overwrite with radioactive green glow if the mouse is interacting on top
              if (hoverInfluence > 0) {
                  this.color.lerp(this.colorHighlight, hoverInfluence * 0.6);
              }

              this.instancedMesh.setColorAt(index, this.color);
              index++;
           }
        }
        
        // Notify the GPU of the algorithmic mutation
        this.instancedMesh.instanceMatrix.needsUpdate = true;
        if(this.instancedMesh.instanceColor) this.instancedMesh.instanceColor.needsUpdate = true;

        this.renderer.render(this.scene, this.camera);
      };
      
      this.animationFrameId = requestAnimationFrame(renderLoop);
    });
  }

  private onWindowResize(): void {
    if(!this.camera || !this.renderer) return;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.isMobile ? 1 : 2));
  }

  private onMouseMove(event: MouseEvent): void {
    const clientX = event.clientX;
    const clientY = event.clientY;
    // Normalize pointer coordinates from -1 to 1 for the WebGL Camera Raycaster
    this.mouse.x = (clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(clientY / window.innerHeight) * 2 + 1;
  }
}
