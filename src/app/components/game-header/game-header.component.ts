import { ChangeDetectionStrategy, Component, ElementRef, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { AuthUser } from '../../interfaces/auth.interface';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-game-header',
  templateUrl: './game-header.component.html',
  styleUrl: './game-header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:click)': 'onDocumentClick($event)',
    '(document:keydown.escape)': 'closeUserMenu()',
  },
})
export class GameHeaderComponent {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly hostElement = inject(ElementRef<HTMLElement>);

  protected readonly loggedUser = signal<AuthUser | null>(this.readStoredUser());
  protected readonly userMenuOpen = signal(false);
  protected readonly displayName = computed(
    () => this.loggedUser()?.username || this.loggedUser()?.name || 'Invitado'
  );
  protected readonly userCoins = computed(() => {
    const user = this.loggedUser() as (AuthUser & {
      coins?: number | string;
      monedas?: number | string;
      gold?: number | string;
    }) | null;

    return this.parseCoins(user?.coins ?? user?.monedas ?? user?.gold);
  });

  protected toggleUserMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.userMenuOpen.update((isOpen) => !isOpen);
  }

  protected closeUserMenu(): void {
    this.userMenuOpen.set(false);
  }

  protected openMyAccount(): void {
    this.closeUserMenu();
    void this.router.navigateByUrl('/account');
  }

  protected logout(): void {
    this.closeUserMenu();
    this.authService.logout();
    this.loggedUser.set(null);
    void this.router.navigateByUrl('/login');
  }

  protected onDocumentClick(event: MouseEvent): void {
    const clickTarget = event.target as Node | null;

    if (!clickTarget) {
      return;
    }

    if (!this.hostElement.nativeElement.contains(clickTarget)) {
      this.closeUserMenu();
    }
  }

  private readStoredUser(): AuthUser | null {
    const rawUser = localStorage.getItem('kardoria_user') ?? sessionStorage.getItem('kardoria_user');

    if (!rawUser) {
      return null;
    }

    try {
      return JSON.parse(rawUser) as AuthUser;
    } catch {
      return null;
    }
  }

  private parseCoins(value: unknown): number {
    if (typeof value === 'number' && Number.isFinite(value) && value >= 0) {
      return Math.floor(value);
    }

    if (typeof value === 'string') {
      const parsed = Number.parseFloat(value);

      if (Number.isFinite(parsed) && parsed >= 0) {
        return Math.floor(parsed);
      }
    }

    return 0;
  }
}
