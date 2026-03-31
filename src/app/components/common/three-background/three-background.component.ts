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

  // Smoothing
  private smoothMouseX = 0;
  private smoothMouseY = 0;

  // Estadísticas Minimalistas: Análisis de Clústers (Red de Nodos)
  private nodesMesh!: THREE.Points;
  private linesMesh!: THREE.LineSegments;
  private particleCount = 200; // Minimalista, un canvas que respira mucho vacío
  
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
    }
  }

  private initThreeJs(): void {
    const container = this.rendererContainer.nativeElement;
    
    this.scene = new THREE.Scene();

    // Vista Ortogonal Profunda para constelaciones (El diseño "Big Data" limpio)
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    this.camera.position.z = 1000;

    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); 
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    container.appendChild(this.renderer.domElement);

    // Sistema de Puntos (Datos Mínimos)
    const pointsGeometry = new THREE.BufferGeometry();
    this.particlePositions = new Float32Array(this.particleCount * 3);
    const particleColors = new Float32Array(this.particleCount * 3);
    
    const colorPrimary = new THREE.Color(0x1DB954); // Spotify Green
    const colorSecondary = new THREE.Color(0xffffff); // White
    
    for (let i = 0; i < this.particleCount; i++) {
       // Esparcidos aleatoriamente imitando un cluster analítico amplio y vacío
       const x = (Math.random() * 2 - 1) * 800;
       const y = (Math.random() * 2 - 1) * 600;
       const z = (Math.random() * 2 - 1) * 400;

       this.particlePositions[i * 3]     = x;
       this.particlePositions[i * 3 + 1] = y;
       this.particlePositions[i * 3 + 2] = z;

       const color = Math.random() > 0.4 ? colorPrimary : colorSecondary;
       particleColors[i * 3]     = color.r;
       particleColors[i * 3 + 1] = color.g;
       particleColors[i * 3 + 2] = color.b;

       // Velocidades bajas para un fondo minimalista y tranquilo (no distrae del contenido real)
       this.particlesData.push({
          velocity: new THREE.Vector3(
             (-1 + Math.random() * 2) * 0.8, 
             (-1 + Math.random() * 2) * 0.8, 
             (-1 + Math.random() * 2) * 0.8
          ),
          numConnections: 0,
          phase: Math.random() * Math.PI * 2,
          originalPos: new THREE.Vector3(x, y, z)
       });
    }

    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(this.particlePositions, 3));
    pointsGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const pointsMaterial = new THREE.PointsMaterial({
      size: 4.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true // Que los puntos lejanos se vean más pequeños
    });

    this.nodesMesh = new THREE.Points(pointsGeometry, pointsMaterial);
    this.scene.add(this.nodesMesh);

    // Conexiones Visibles (La Red de Datos)
    const linesGeometry = new THREE.BufferGeometry();
    const segments = new Float32Array(this.particleCount * this.particleCount * 3); // Limite superior
    linesGeometry.setAttribute('position', new THREE.BufferAttribute(segments, 3));
    
    const lineColors = new Float32Array(this.particleCount * this.particleCount * 3);
    linesGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

    const linesMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.25, // Tenue, "minimalista"
      blending: THREE.AdditiveBlending
    });

    this.linesMesh = new THREE.LineSegments(linesGeometry, linesMaterial);
    this.scene.add(this.linesMesh);
  }

  private animate(): void {
    this.ngZone.runOutsideAngular(() => {
      const renderLoop = () => {
        this.animationFrameId = requestAnimationFrame(renderLoop);

        this.smoothMouseX += (this.mouseX - this.smoothMouseX) * 0.1;
        this.smoothMouseY += (this.mouseY - this.smoothMouseY) * 0.1;

        // Proyectar el MOUSE estadísticamente en el plano del modelo 3D
        // Z es aprox 1000, un buen offset manual para que siga el ratón en la matriz local
        const worldMouseX = this.smoothMouseX * 800;
        const worldMouseY = this.smoothMouseY * 500;
        const interactionRadius = 250; // Gran radio de choque interactivo

        let vertexpos = 0;
        let colorpos = 0;
        let numConnected = 0; // Líneas activas

        const positions = this.nodesMesh.geometry.attributes['position'].array as Float32Array;

        for (let i = 0; i < this.particleCount; i++) {
           const pData = this.particlesData[i];

           // Movimientos de flotación constantes (Vida Base)
           positions[i * 3]     += pData.velocity.x;
           positions[i * 3 + 1] += pData.velocity.y;
           positions[i * 3 + 2] += pData.velocity.z;

           // Fronteras del Universo Minimalista (rebote si salen volando lejos o chocan paredes)
           if (positions[i * 3] < -900 || positions[i * 3] > 900) pData.velocity.x = -pData.velocity.x;
           if (positions[i * 3 + 1] < -700 || positions[i * 3 + 1] > 700) pData.velocity.y = -pData.velocity.y;
           if (positions[i * 3 + 2] < -500 || positions[i * 3 + 2] > 500) pData.velocity.z = -pData.velocity.z;

           // ====== A. FÍSICA Y ENLACE INTERACTIVO DEL RATÓN ======
           const dxMouse = positions[i * 3] - worldMouseX;
           const dyMouse = positions[i * 3 + 1] - worldMouseY;
           const distToMouse = Math.sqrt(dxMouse*dxMouse + dyMouse*dyMouse);

           if (distToMouse < interactionRadius) {
              // Si el cursor toca un nodo, este trata de escapar suavemente para parecer orgánico
              const force = (interactionRadius - distToMouse) * 0.001; 
              pData.velocity.x += (dxMouse / distToMouse) * force;
              pData.velocity.y += (dyMouse / distToMouse) * force;
              
              // Animación Extra: Dibuja un lazo fuerte conectando el Ratón con este Nodo (Vínculo Directo)
              const linePos = this.linesMesh.geometry.attributes['position'].array as Float32Array;
              linePos[vertexpos++] = positions[i * 3];
              linePos[vertexpos++] = positions[i * 3 + 1];
              linePos[vertexpos++] = positions[i * 3 + 2];

              linePos[vertexpos++] = worldMouseX;
              linePos[vertexpos++] = worldMouseY;
              linePos[vertexpos++] = 200; // Z simulado del ratón a media profundidad
              
              // Pintar el Vínculo del Ratón en Blanco Brillante (Destacar la interacción estadística)
              const lineColors = this.linesMesh.geometry.attributes['color'].array as Float32Array;
              lineColors[colorpos++] = 1.0; lineColors[colorpos++] = 1.0; lineColors[colorpos++] = 1.0; 
              lineColors[colorpos++] = 1.0; lineColors[colorpos++] = 1.0; lineColors[colorpos++] = 1.0; 
              numConnected++;
           } else {
             // Retomar la paz minimalista si el usuario se aleja
              pData.velocity.multiplyScalar(0.98); // Slow down friction
              if(pData.velocity.length() < 0.2) pData.velocity.multiplyScalar(1.05); // Recover
           }

           // ====== B. RED ESTADÍSTICA (Nodos Relacionados en Clústers) ======
           for (let j = i + 1; j < this.particleCount; j++) {
              const dx = positions[i * 3] - positions[j * 3];
              const dy = positions[i * 3 + 1] - positions[j * 3];
              const dz = positions[i * 3 + 2] - positions[j * 3];
              const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

              // Solo los nodos estadísticamente cercanos trazan un vínculo
              if (dist < 150) {
                 const linePos = this.linesMesh.geometry.attributes['position'].array as Float32Array;
                 linePos[vertexpos++] = positions[i * 3];
                 linePos[vertexpos++] = positions[i * 3 + 1];
                 linePos[vertexpos++] = positions[i * 3 + 2];

                 linePos[vertexpos++] = positions[j * 3];
                 linePos[vertexpos++] = positions[j * 3 + 1];
                 linePos[vertexpos++] = positions[j * 3 + 2];

                 const lineColors = this.linesMesh.geometry.attributes['color'].array as Float32Array;
                 
                 // Colorear conexiones base sutilmente verdes en honor al sistema
                 lineColors[colorpos++] = 0.11; // R (aprox 29)
                 lineColors[colorpos++] = 0.72; // G (aprox 185)
                 lineColors[colorpos++] = 0.32; // B (aprox 84)
                 lineColors[colorpos++] = 0.11; lineColors[colorpos++] = 0.72; lineColors[colorpos++] = 0.32;
                 
                 numConnected++;
              }
           }
        }

        // Actualizar mallas en memoria del GPU
        this.linesMesh.geometry.setDrawRange(0, numConnected * 2);
        this.linesMesh.geometry.attributes['position'].needsUpdate = true;
        this.linesMesh.geometry.attributes['color'].needsUpdate = true;
        this.nodesMesh.geometry.attributes['position'].needsUpdate = true;

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
    // Espacio de Coordenadas de Cámara
    this.mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  }
}
