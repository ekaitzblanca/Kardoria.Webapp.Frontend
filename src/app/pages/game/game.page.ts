import { ChangeDetectionStrategy, Component, ElementRef, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { AuthUser } from '../../interfaces/auth.interface';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-game-page',
  templateUrl: './game.page.html',
  styleUrl: './game.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:click)': 'onDocumentClick($event)',
    '(document:keydown.escape)': 'closeUserMenu()',
  },
})
export class GamePage {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly hostElement = inject(ElementRef<HTMLElement>);

  protected readonly loggedUser = signal<AuthUser | null>(this.readStoredUser());
  protected readonly userMenuOpen = signal(false);
  protected readonly displayName = computed(
    () => this.loggedUser()?.username || this.loggedUser()?.name || 'Invitado'
  );

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
}
