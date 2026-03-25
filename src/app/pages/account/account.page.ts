import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { AuthUser } from '../../interfaces/auth.interface';

@Component({
  selector: 'app-account-page',
  templateUrl: './account.page.html',
  styleUrl: './account.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountPage {
  protected readonly loggedUser = signal<AuthUser | null>(this.readStoredUser());

  protected readonly fullName = computed(() => this.loggedUser()?.name || 'Sin nombre');
  protected readonly username = computed(() => this.loggedUser()?.username || 'Sin usuario');
  protected readonly email = computed(() => this.loggedUser()?.email || 'Sin correo');

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
