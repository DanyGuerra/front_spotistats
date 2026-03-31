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
  
  // Interacción del Usuario
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2(-1000, -1000); 
  private intersectPoint = new THREE.Vector3();
  private planeForRaycast = new THREE.Plane(new THREE.Vector3(0, 1, 0), 100); 

  // Malla Instanciada para los gráficos de barra (Ondas + Stats)
  private instancedMesh!: THREE.InstancedMesh;
  private cols = 120;
  private rows = 50;
  private spacingX = 22;
  private spacingZ = 22;
  private globalTime = 0;

  // Optimización de Memoria
  private dummy = new THREE.Object3D();
  private color = new THREE.Color();
  
  // Temática de Colores: Ondas Musicales de Spotify
  private colorBase = new THREE.Color('#0A0A0A'); // Fondo oscuro pero visible 
  private colorMid = new THREE.Color('#1E1E1E'); // Gris tenue para dar volumen
  private colorPrimary = new THREE.Color('#1DB954'); // Verde Spotify Clásico vivo
  private colorHighlight = new THREE.Color('#4bd57a'); // Verde iluminado para picos altos sin cegar al texto
  
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
      if(this.instancedMesh) {
         this.instancedMesh.geometry.dispose();
         (this.instancedMesh.material as THREE.Material).dispose();
      }
    }
  }

  private initThreeJs(): void {
    const container = this.rendererContainer.nativeElement;
    
    this.scene = new THREE.Scene();
    
    // Profundidad de Niebla inmersiva ajustada a un balance medio
    this.scene.fog = new THREE.FogExp2(0x0A0A0A, 0.0012);

    // Cámara posicionada viendo "Hacia Abajo y al Horizonte" como un panel de datos
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 4000);
    this.camera.position.set(0, 250, 700);
    this.camera.lookAt(0, -100, 0);

    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' }); 
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(this.renderer.domElement);

    // Construcción del Campo de Bar Graphs (Ecualizador)
    const count = this.cols * this.rows;
    // Cajas sólidas y verticales
    const geometry = new THREE.BoxGeometry(11, 1, 11);
    
    const material = new THREE.MeshBasicMaterial({ 
       color: 0xffffff,
       transparent: true,
       opacity: 0.70 // Balance perfecto del 70%, no lastima los textos ni tampoco borra tu arte del mapa
    });

    this.instancedMesh = new THREE.InstancedMesh(geometry, material, count);
    this.scene.add(this.instancedMesh);
  }

  private animate(): void {
    this.ngZone.runOutsideAngular(() => {
      const renderLoop = () => {
        this.animationFrameId = requestAnimationFrame(renderLoop);

        // Disparar el Raycaster al plano invisible para calcular el punto exacto bajo el mouse en 3D
        this.raycaster.setFromCamera(this.mouse, this.camera);
        this.raycaster.ray.intersectPlane(this.planeForRaycast, this.intersectPoint);

        this.globalTime += 1;
        const time = this.globalTime * 0.008; // 3 veces más lento que antes (0.03 -> 0.008)

        let index = 0;

        for (let x = 0; x < this.cols; x++) {
           for (let z = 0; z < this.rows; z++) {
              
              const worldX = (x - this.cols / 2) * this.spacingX;
              const worldZ = (z - this.rows / 2) * this.spacingZ;
              
              // 1. ONDA MUSICAL BASE Múltiple Cruzada (Frecuencias más bajas y relajantes = "Smoth")
              let waveAmplitude = Math.sin(worldX * 0.006 + time) * 12 
                                + Math.cos(worldZ * 0.008 - time * 0.5) * 12;
              
              // 2. LA FRECUENCIA MAESTRA (Una pista de audio central simulada de Izq a Der)
              const centerDistZ = Math.abs(worldZ);
              if (centerDistZ < 300) {
                  // A mayor cercanía al centro, mayor volumen estadístico
                  const trackPulse = Math.max(0, 1.0 - (centerDistZ / 300));
                  // Forma de onda de altibajos agresiva relajada un poco
                  const eqWave = Math.sin(worldX * 0.02 + time * 2) * Math.cos(worldX * 0.01) * 35;
                  waveAmplitude += trackPulse * eqWave;
              }

              // 3. INTERACCIÓN DEL USUARIO (El Cursor levanta la estadística y cambia su espectro)
              let hoverInfluence = 0;
              if (this.intersectPoint) {
                  const dx = worldX - this.intersectPoint.x;
                  const dz = worldZ - this.intersectPoint.z;
                  const dist = Math.sqrt(dx * dx + dz * dz);

                  // Radio de influencia sobre el mar de datos
                  if (dist < 280) {
                      hoverInfluence = Math.pow((280 - dist) / 280, 2);
                      // Onda de rebote interactiva con menos punzada agresiva (Smothness visual)
                      const interactiveSpike = Math.cos(dist * 0.06 - time * 4) * 50;
                      // El usuario literalmente forma picos topográficos
                      waveAmplitude += Math.max(0, interactiveSpike * hoverInfluence);
                  }
              }

              // Establecemos una altura mínima sana
              const finalHeight = Math.max(2, waveAmplitude + 40);
              
              // Crecimientos hacia arriba anclando el piso. (y = height / 2 ajusta el fondo siempre a -100)
              this.dummy.position.set(worldX, -150 + finalHeight / 2, worldZ);
              this.dummy.scale.set(1, finalHeight, 1);
              this.dummy.updateMatrix();
              
              this.instancedMesh.setMatrixAt(index, this.dummy.matrix);

              // 4. MAPEO DE TEMPERATURA / COLORES ESTADÍSTICOS
              // Dependiendo del "Volumen de Data" (Altura de la onda), pintamos el bloque
              const colorRatio = Math.min(1.0, Math.max(0, finalHeight / 110)); 
              
              // Lerp Tricolor: Oscuro -> Verde Spotify -> Blanco Brillante
              if (colorRatio < 0.5) {
                  const localRatio = colorRatio * 2.0; 
                  this.color.copy(this.colorBase).lerp(this.colorPrimary, localRatio);
              } else {
                  const localRatio = (colorRatio - 0.5) * 2.0;
                  this.color.copy(this.colorPrimary).lerp(this.colorHighlight, localRatio);
              }

              // Sobreescribir con resplandor verde radioactivo si el mouse está interactuando encima
              if (hoverInfluence > 0) {
                  this.color.lerp(this.colorHighlight, hoverInfluence * 0.6);
              }

              this.instancedMesh.setColorAt(index, this.color);
              index++;
           }
        }
        
        // Avisar a la GPU de la mutación algorítmica
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
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  private onMouseMove(event: MouseEvent): void {
    const clientX = event.clientX;
    const clientY = event.clientY;
    // Normalizar coordenadas del puntero de -1 a 1 para el Raycaster de la Cámara WebGL
    this.mouse.x = (clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(clientY / window.innerHeight) * 2 + 1;
  }
}
