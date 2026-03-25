import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { LoginRequest } from '../../interfaces/auth.interface';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.page.html',
  styleUrl: './login.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly availableCardImages = [
    '/cards/001.png',
    '/cards/002.png',
    '/cards/003.png',
    '/cards/004.png',
    '/cards/005.png',
    '/cards/006.png',
    '/cards/007.png',
    '/cards/008.png',
    '/cards/009.png',
    '/cards/010.png',
  ];
  private readonly backgroundCardCount = 10;

  protected readonly submitAttempted = signal(false);
  protected readonly isSubmitting = signal(false);
  protected readonly authError = signal<string | null>(null);
  protected readonly backgroundCardImages = this.createBackgroundImages();

  protected readonly loginForm = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    remember: [true],
  });

  protected readonly showErrors = computed(() => this.submitAttempted() || this.loginForm.touched);

  protected submit(): void {
    this.submitAttempted.set(true);
    this.authError.set(null);

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const payload: LoginRequest = {
      username: this.loginForm.controls.username.getRawValue(),
      password: this.loginForm.controls.password.getRawValue(),
    };

    this.isSubmitting.set(true);

    this.authService
      .login(payload)
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: (response) => {
          const storage = this.loginForm.controls.remember.getRawValue() ? localStorage : sessionStorage;
          const secondaryStorage = storage === localStorage ? sessionStorage : localStorage;

          secondaryStorage.removeItem('kardoria_user');
          storage.setItem('kardoria_user', JSON.stringify(response.user));
          void this.router.navigateByUrl('/game');
        },
        error: (error: HttpErrorResponse) => {
          const message =
            typeof error.error?.detail === 'string'
              ? error.error.detail
              : 'No se pudo iniciar sesion. Intentalo de nuevo.';

          this.authError.set(message);
        },
      });
  }

  private createBackgroundImages(): string[] {
    const source = this.availableCardImages.length > 0 ? this.availableCardImages : ['/cards/001.png'];
    const images: string[] = [];
    let pool = this.shuffleImages(source);

    for (let index = 0; index < this.backgroundCardCount; index += 1) {
      if (pool.length === 0) {
        pool = this.shuffleImages(source);
      }

      const image = pool.pop();
      if (image) {
        images.push(image);
      }
    }

    return images;
  }

  private shuffleImages(images: string[]): string[] {
    const shuffled = [...images];

    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
    }

    return shuffled;
  }
}
