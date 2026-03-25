import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  NgZone,
  OnDestroy,
  inject,
  signal,
  viewChildren,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';
import {
  AmbientLight,
  BoxGeometry,
  Clock,
  Color,
  Group,
  Mesh,
  MeshStandardMaterial,
  OrthographicCamera,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  TorusGeometry,
  WebGLRenderer,
} from 'three';

export type GameMenuOption = 'collection' | 'inventory' | 'profile' | 'boosters' | 'market';

interface MenuOption {
  id: GameMenuOption;
  label: string;
}

interface SceneBundle {
  canvas: HTMLCanvasElement;
  renderer: WebGLRenderer;
  scene: Scene;
  camera: PerspectiveCamera | OrthographicCamera;
  root: Group;
  clock: Clock;
}

@Component({
  selector: 'app-game-menu',
  templateUrl: './game-menu.component.html',
  styleUrl: './game-menu.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameMenuComponent implements AfterViewInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly ngZone = inject(NgZone);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly canvasRefs = viewChildren<ElementRef<HTMLCanvasElement>>('optionCanvas');

  private readonly bundles = new Map<GameMenuOption, SceneBundle>();
  private readonly resizeObservers: ResizeObserver[] = [];
  private animationFrameId = 0;

  protected readonly activeOption = signal<GameMenuOption>('profile');
  protected readonly hoveredOption = signal<GameMenuOption | null>(null);
  protected readonly options: MenuOption[] = [
    {
      id: 'collection',
      label: 'Coleccion',
    },
    {
      id: 'inventory',
      label: 'Inventario',
    },
    {
      id: 'profile',
      label: 'Profile',
    },
    {
      id: 'boosters',
      label: 'Sobres',
    },
    {
      id: 'market',
      label: 'Mercado',
    },
  ];

  constructor() {
    this.syncActiveOptionFromRoute();

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.syncActiveOptionFromRoute();
      });
  }

  protected selectOption(option: GameMenuOption): void {
    if (this.activeOption() === option) {
      return;
    }

    this.activeOption.set(option);
    void this.router.navigate([option], { relativeTo: this.route });
  }

  protected isActive(option: GameMenuOption): boolean {
    return this.activeOption() === option;
  }

  protected setHoveredOption(option: GameMenuOption | null): void {
    this.hoveredOption.set(option);
  }

  ngAfterViewInit(): void {
    const canvasElements = this.canvasRefs();

    for (const canvasRef of canvasElements) {
      const canvas = canvasRef.nativeElement;
      const optionId = canvas.dataset['option'] as GameMenuOption | undefined;

      if (!optionId) {
        continue;
      }

      const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      const bundle = this.createSceneForOption(optionId, canvas, renderer);
      this.bundles.set(optionId, bundle);

      const resizeObserver = new ResizeObserver(() => {
        this.resizeRendererForCanvas(optionId, canvas);
      });

      resizeObserver.observe(canvas);
      this.resizeObservers.push(resizeObserver);

      this.resizeRendererForCanvas(optionId, canvas);
    }

    this.ngZone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        for (const [option, bundle] of this.bundles.entries()) {
          this.resizeRendererForCanvas(option, bundle.canvas);
        }
      });

      this.animate();
    });

    this.cdr.markForCheck();
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    for (const resizeObserver of this.resizeObservers) {
      resizeObserver.disconnect();
    }

    for (const bundle of this.bundles.values()) {
      bundle.renderer.dispose();

      for (const child of bundle.root.children) {
        const mesh = child as Mesh;
        mesh.geometry.dispose();

        if (Array.isArray(mesh.material)) {
          for (const material of mesh.material) {
            material.dispose();
          }
        } else {
          mesh.material.dispose();
        }
      }
    }

    this.bundles.clear();
  }

  private createSceneForOption(option: GameMenuOption, canvas: HTMLCanvasElement, renderer: WebGLRenderer): SceneBundle {
    const scene = new Scene();
    const root = new Group();
    const clock = new Clock();

    scene.add(new AmbientLight(new Color('#b7deff'), 1.1));
    scene.add(root);

    if (option === 'collection') {
      root.add(this.createCardMesh(-0.45, -0.02, -0.2));
      root.add(this.createCardMesh(0, 0.03, 0));
      root.add(this.createCardMesh(0.45, -0.02, 0.2));
    }

    if (option === 'profile') {
      const head = new Mesh(
        new SphereGeometry(0.35, 24, 24),
        new MeshStandardMaterial({ color: new Color('#86e2ff'), metalness: 0.28, roughness: 0.35 })
      );
      head.position.y = 0.35;

      const torso = new Mesh(
        new TorusGeometry(0.45, 0.16, 20, 42, Math.PI),
        new MeshStandardMaterial({ color: new Color('#66b8ff'), metalness: 0.32, roughness: 0.33 })
      );
      torso.rotation.x = Math.PI;
      torso.position.y = -0.18;

      root.add(head, torso);
    }

    if (option === 'inventory') {
      const crateBase = new Mesh(
        new BoxGeometry(0.9, 0.58, 0.58),
        new MeshStandardMaterial({ color: new Color('#7ab8ff'), metalness: 0.28, roughness: 0.38 })
      );

      const crateTop = new Mesh(
        new BoxGeometry(0.72, 0.42, 0.52),
        new MeshStandardMaterial({ color: new Color('#99d0ff'), metalness: 0.24, roughness: 0.35 })
      );
      crateTop.position.set(0.18, 0.5, 0.05);

      root.add(crateBase, crateTop);
    }

    if (option === 'boosters') {
      const pack = new Mesh(
        new BoxGeometry(0.78, 1.1, 0.1),
        new MeshStandardMaterial({ color: new Color('#8df4cf'), metalness: 0.24, roughness: 0.31 })
      );
      const flap = new Mesh(
        new BoxGeometry(0.82, 0.18, 0.09),
        new MeshStandardMaterial({ color: new Color('#54d7a5'), metalness: 0.22, roughness: 0.34 })
      );
      flap.position.y = 0.62;
      flap.rotation.z = 0.14;

      root.add(pack, flap);
    }

    if (option === 'market') {
      const booth = new Mesh(
        new BoxGeometry(1.05, 0.4, 0.45),
        new MeshStandardMaterial({ color: new Color('#67b4ff'), metalness: 0.3, roughness: 0.36 })
      );
      booth.position.y = -0.35;

      const canopy = new Mesh(
        new BoxGeometry(1.18, 0.2, 0.48),
        new MeshStandardMaterial({ color: new Color('#8cf2cf'), metalness: 0.25, roughness: 0.34 })
      );
      canopy.position.y = 0.28;

      const emblem = new Mesh(
        new SphereGeometry(0.18, 20, 20),
        new MeshStandardMaterial({ color: new Color('#ffd36a'), metalness: 0.52, roughness: 0.25 })
      );
      emblem.position.set(0, -0.05, 0.29);

      root.add(booth, canopy, emblem);
    }

    root.scale.setScalar(0.92);

    const camera = option === 'profile'
      ? new PerspectiveCamera(36, 1, 0.1, 20)
      : new OrthographicCamera(-1.35, 1.35, 1, -1, 0.1, 20);

    camera.position.z = 3.7;

    if (camera instanceof PerspectiveCamera) {
      camera.position.y = 0.08;
    }

    return { canvas, renderer, scene, camera, root, clock };
  }

  private createCardMesh(x: number, y: number, rotateY: number): Mesh {
    const card = new Mesh(
      new BoxGeometry(0.5, 0.84, 0.06),
      new MeshStandardMaterial({ color: new Color('#7ebfff'), metalness: 0.3, roughness: 0.31 })
    );

    card.position.set(x, y, 0);
    card.rotation.y = rotateY;

    return card;
  }

  private resizeRendererForCanvas(option: GameMenuOption, canvas: HTMLCanvasElement): void {
    const bundle = this.bundles.get(option);

    if (!bundle) {
      return;
    }

    const width = Math.max(canvas.clientWidth, 1);
    const height = Math.max(canvas.clientHeight, 1);

    bundle.renderer.setSize(width, height, false);

    if (bundle.camera instanceof PerspectiveCamera) {
      bundle.camera.aspect = width / height;
      bundle.camera.updateProjectionMatrix();
      return;
    }

    const ratio = width / height;
    const size = 1.1;

    bundle.camera.left = -size * ratio;
    bundle.camera.right = size * ratio;
    bundle.camera.top = size;
    bundle.camera.bottom = -size;
    bundle.camera.updateProjectionMatrix();
  }

  private animate(): void {
    for (const [option, bundle] of this.bundles.entries()) {
      this.resizeRendererForCanvas(option, bundle.canvas);

      const isActive = this.activeOption() === option;
      const isHovered = this.hoveredOption() === option;
      const targetScale = isHovered ? 1.08 : 0.92;
      const currentScale = bundle.root.scale.x;
      const nextScale = currentScale + (targetScale - currentScale) * 0.16;

      bundle.root.scale.setScalar(nextScale);
      bundle.root.rotation.x = isActive ? 0.08 : 0;
      bundle.root.rotation.y = 0;

      bundle.renderer.render(bundle.scene, bundle.camera);
    }

    this.animationFrameId = requestAnimationFrame(() => {
      this.animate();
    });
  }

  private syncActiveOptionFromRoute(): void {
    const pathWithoutQuery = this.router.url.split('?')[0];
    const segments = pathWithoutQuery.split('/').filter(Boolean);
    const gameSection = segments[1];

    if (gameSection && this.isMenuOption(gameSection)) {
      this.activeOption.set(gameSection);
    }
  }

  private isMenuOption(value: string): value is GameMenuOption {
    return this.options.some((option) => option.id === value);
  }
}
