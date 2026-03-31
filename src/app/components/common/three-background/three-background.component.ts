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
  
  private mouseX = 0;
  private mouseY = 0;
  private smoothMouseX = 0;
  private smoothMouseY = 0;

  private nodesMesh!: THREE.Points;
  private linesMesh!: THREE.LineSegments;
  private particleCount = 200; 
  private globalTime = 0;
  
  private mouseTrailMesh!: THREE.Line;
  private mouseTrailGeometry!: THREE.BufferGeometry;
  private maxTrailPoints = 30; 
  
  private particlesData: { velocity: THREE.Vector3; numConnections: number; phase: number; originalPos: THREE.Vector3 }[] = [];
  private particlePositions!: Float32Array;

  constructor(private ngZone: NgZone) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initThreeJs();
    this.animate();

    this.onWindowResize = this.onWindowResize.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    
    window.addEventListener('resize', this.onWindowResize);
    window.addEventListener('mousemove', this.onMouseMove);
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.onWindowResize);
    window.removeEventListener('mousemove', this.onMouseMove);

    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }

    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.forceContextLoss();
    }
    
    if (this.scene) {
      this.scene.clear();
      if(this.nodesMesh) {
         this.nodesMesh.geometry.dispose();
         (this.nodesMesh.material as THREE.Material).dispose();
      }
      if(this.linesMesh) {
         this.linesMesh.geometry.dispose();
         (this.linesMesh.material as THREE.Material).dispose();
      }
      if(this.mouseTrailMesh) {
         this.mouseTrailGeometry.dispose();
         (this.mouseTrailMesh.material as THREE.Material).dispose();
      }
    }
  }

  private getGlowTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 64; canvas.height = 64;
    const ctx = canvas.getContext('2d')!;
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)'); 
    gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.95)'); 
    gradient.addColorStop(0.8, 'rgba(255, 255, 255, 0.5)'); 
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(canvas);
  }

  private initThreeJs(): void {
    const container = this.rendererContainer.nativeElement;
    
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x121212, 0.0009); 

    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2500);
    this.camera.position.z = 1000;

    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' }); 
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(this.renderer.domElement);

    const pointsGeometry = new THREE.BufferGeometry();
    this.particlePositions = new Float32Array(this.particleCount * 3);
    const particleColors = new Float32Array(this.particleCount * 3);
    
    const colorPrimary = new THREE.Color(0x1ed760); 
    const colorSecondary = new THREE.Color(0xffffff); 
    
    for (let i = 0; i < this.particleCount; i++) {
       const x = (Math.random() * 2 - 1) * 900;
       const y = (Math.random() * 2 - 1) * 700;
       const z = (Math.random() * 2 - 1) * 600;

       this.particlePositions[i * 3]     = x;
       this.particlePositions[i * 3 + 1] = y;
       this.particlePositions[i * 3 + 2] = z;

       const color = Math.random() > 0.4 ? colorPrimary : colorSecondary;
       particleColors[i * 3]     = color.r;
       particleColors[i * 3 + 1] = color.g;
       particleColors[i * 3 + 2] = color.b;

       this.particlesData.push({
          velocity: new THREE.Vector3(0, 0, 0),
          numConnections: 0,
          phase: Math.random() * Math.PI * 2,
          originalPos: new THREE.Vector3(x, y, z)
       });
    }

    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(this.particlePositions, 3));
    pointsGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const pointsMaterial = new THREE.PointsMaterial({
      size: 20, 
      vertexColors: true,
      map: this.getGlowTexture(),
      transparent: true,
      opacity: 1.0, 
      depthWrite: false, 
      blending: THREE.AdditiveBlending 
    });

    this.nodesMesh = new THREE.Points(pointsGeometry, pointsMaterial);
    this.scene.add(this.nodesMesh);

    const linesGeometry = new THREE.BufferGeometry();
    const segments = new Float32Array(this.particleCount * this.particleCount * 3); 
    linesGeometry.setAttribute('position', new THREE.BufferAttribute(segments, 3));
    
    const lineColors = new Float32Array(this.particleCount * this.particleCount * 3);
    linesGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

    const linesMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.85,  
      blending: THREE.AdditiveBlending, 
      depthWrite: false,
      linewidth: 2 
    });

    this.linesMesh = new THREE.LineSegments(linesGeometry, linesMaterial);
    this.scene.add(this.linesMesh);

    const trailPositions = new Float32Array(this.maxTrailPoints * 3);
    const trailColors = new Float32Array(this.maxTrailPoints * 3);
    for(let i = 0; i < this.maxTrailPoints; i++){
       const intensity = Math.max(0, 1.0 - (i / (this.maxTrailPoints - 1)));
       trailColors[i*3] = 0.4 * intensity; 
       trailColors[i*3+1] = 1.0 * intensity; 
       trailColors[i*3+2] = 0.6 * intensity;
    }
    this.mouseTrailGeometry = new THREE.BufferGeometry();
    this.mouseTrailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
    this.mouseTrailGeometry.setAttribute('color', new THREE.BufferAttribute(trailColors, 3));
    
    const trailMaterial = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.9, 
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        linewidth: 3 
    });
    this.mouseTrailMesh = new THREE.Line(this.mouseTrailGeometry, trailMaterial);
    this.scene.add(this.mouseTrailMesh);
  }

  private animate(): void {
    this.ngZone.runOutsideAngular(() => {
      const renderLoop = () => {
        this.animationFrameId = requestAnimationFrame(renderLoop);

        this.smoothMouseX += (this.mouseX - this.smoothMouseX) * 0.05;
        this.smoothMouseY += (this.mouseY - this.smoothMouseY) * 0.05;

        const worldMouseX = this.smoothMouseX * 1000;
        const worldMouseY = this.smoothMouseY * 600;
        const interactionRadius = 350; 

        // Update Mouse Trail
        const trailPos = this.mouseTrailGeometry.attributes['position'].array as Float32Array;
        for (let i = this.maxTrailPoints - 1; i > 0; i--) {
             trailPos[i * 3] += (trailPos[(i - 1) * 3] - trailPos[i * 3]) * 0.4;
             trailPos[i * 3 + 1] += (trailPos[(i - 1) * 3 + 1] - trailPos[i * 3 + 1]) * 0.4;
             trailPos[i * 3 + 2] = 200;
        }
        trailPos[0] = worldMouseX;
        trailPos[1] = worldMouseY;
        trailPos[2] = 200; 
        this.mouseTrailGeometry.attributes['position'].needsUpdate = true;

        const heartbeat = 18 + Math.sin(this.globalTime * 0.02) * 4;
        (this.nodesMesh.material as THREE.PointsMaterial).size = heartbeat;

        let vertexpos = 0;
        let colorpos = 0;
        let numConnected = 0; 
        
        const nodeColors = this.nodesMesh.geometry.attributes['color'].array as Float32Array;
        const positions = this.nodesMesh.geometry.attributes['position'].array as Float32Array;
        
        const timeOffset = this.globalTime * 0.0005;

        for (let i = 0; i < this.particleCount; i++) {
           this.particlesData[i].numConnections = 0;
        }

        for (let i = 0; i < this.particleCount; i++) {
           const pData = this.particlesData[i];

           const flowX = Math.sin(positions[i * 3 + 1] * 0.005 + timeOffset) * 0.02 + Math.cos(positions[i * 3 + 2] * 0.004 + timeOffset) * 0.02;
           const flowY = Math.sin(positions[i * 3 + 2] * 0.005 + timeOffset) * 0.02 + Math.cos(positions[i * 3] * 0.004 + timeOffset) * 0.02;
           const flowZ = Math.sin(positions[i * 3] * 0.005 + timeOffset) * 0.02 + Math.cos(positions[i * 3 + 1] * 0.004 + timeOffset) * 0.02;

           pData.velocity.x += flowX;
           pData.velocity.y += flowY;
           pData.velocity.z += flowZ;

           positions[i * 3]     += pData.velocity.x;
           positions[i * 3 + 1] += pData.velocity.y;
           positions[i * 3 + 2] += pData.velocity.z;

           if (positions[i * 3] < -900) pData.velocity.x += 0.05;
           if (positions[i * 3] > 900) pData.velocity.x -= 0.05;
           if (positions[i * 3 + 1] < -600) pData.velocity.y += 0.05;
           if (positions[i * 3 + 1] > 600) pData.velocity.y -= 0.05;
           if (positions[i * 3 + 2] < -500) pData.velocity.z += 0.05;
           if (positions[i * 3 + 2] > 500) pData.velocity.z -= 0.05;

           const dxMouse = positions[i * 3] - worldMouseX;
           const dyMouse = positions[i * 3 + 1] - worldMouseY;
           const distToMouse = Math.sqrt(dxMouse*dxMouse + dyMouse*dyMouse);

           // Interacción al pasar cerca del cursor (Hover)
           if (distToMouse < interactionRadius) {
              const force = (interactionRadius - distToMouse) * 0.0005; 
              
              // Los nodos esquivan sutilmente el cursor
              pData.velocity.x += (dxMouse / distToMouse) * force;
              pData.velocity.y += (dyMouse / distToMouse) * force;
              
              const linePos = this.linesMesh.geometry.attributes['position'].array as Float32Array;
              linePos[vertexpos++] = positions[i * 3];
              linePos[vertexpos++] = positions[i * 3 + 1];
              linePos[vertexpos++] = positions[i * 3 + 2];
              linePos[vertexpos++] = worldMouseX;
              linePos[vertexpos++] = worldMouseY;
              linePos[vertexpos++] = 200; 
              
              const lineColors = this.linesMesh.geometry.attributes['color'].array as Float32Array;
              
              lineColors[colorpos++] = 1.0; lineColors[colorpos++] = 1.0; lineColors[colorpos++] = 1.0; 
              lineColors[colorpos++] = 1.0; lineColors[colorpos++] = 1.0; lineColors[colorpos++] = 1.0; 
              
              numConnected++;
           }

           pData.velocity.multiplyScalar(0.95); 

           if (pData.velocity.length() < 0.1) {
               pData.velocity.add(pData.originalPos.clone().normalize().multiplyScalar(0.002));
           }
           
           const targetR = i % 2 === 0 ? 0.11 : 1.0;
           const targetG = i % 2 === 0 ? 0.85 : 1.0;
           const targetB = i % 2 === 0 ? 0.32 : 1.0;
           
           nodeColors[i * 3] += (targetR - nodeColors[i * 3]) * 0.02;
           nodeColors[i * 3 + 1] += (targetG - nodeColors[i * 3 + 1]) * 0.02;
           nodeColors[i * 3 + 2] += (targetB - nodeColors[i * 3 + 2]) * 0.02;

           for (let j = i + 1; j < this.particleCount; j++) {
              if (pData.numConnections > 4) break; 
              
              const dx = positions[i * 3] - positions[j * 3];
              const dy = positions[i * 3 + 1] - positions[j * 3];
              const dz = positions[i * 3 + 2] - positions[j * 3];
              const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

              if (dist < 180) {
                 const linePos = this.linesMesh.geometry.attributes['position'].array as Float32Array;
                 linePos[vertexpos++] = positions[i * 3];
                 linePos[vertexpos++] = positions[i * 3 + 1];
                 linePos[vertexpos++] = positions[i * 3 + 2];
                 linePos[vertexpos++] = positions[j * 3];
                 linePos[vertexpos++] = positions[j * 3 + 1];
                 linePos[vertexpos++] = positions[j * 3 + 2];

                 const lineColors = this.linesMesh.geometry.attributes['color'].array as Float32Array;
                 const baseAlpha = 1.0 - (dist / 180);
                 
                 lineColors[colorpos++] = 0.33 * baseAlpha; 
                 lineColors[colorpos++] = 1.00 * baseAlpha; 
                 lineColors[colorpos++] = 0.55 * baseAlpha;
                 lineColors[colorpos++] = 0.33 * baseAlpha; 
                 lineColors[colorpos++] = 1.00 * baseAlpha; 
                 lineColors[colorpos++] = 0.55 * baseAlpha;
                 
                 pData.numConnections++;
                 this.particlesData[j].numConnections++;
                 numConnected++;
              }
           }
        }

        this.linesMesh.geometry.setDrawRange(0, numConnected * 2);
        this.linesMesh.geometry.attributes['position'].needsUpdate = true;
        this.linesMesh.geometry.attributes['color'].needsUpdate = true;
        
        this.nodesMesh.geometry.attributes['color'].needsUpdate = true;
        this.nodesMesh.geometry.attributes['position'].needsUpdate = true;

        this.globalTime += 1;
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
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  private onMouseMove(event: MouseEvent): void {
    const clientX = event.clientX;
    const clientY = event.clientY;
    this.mouseX = (clientX / window.innerWidth) * 2 - 1;
    this.mouseY = -(clientY / window.innerHeight) * 2 + 1;
  }
}
