import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

function matchingPasswords(control: AbstractControl): { passwordMismatch: true } | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  if (!password || !confirmPassword) {
    return null;
  }

  return password === confirmPassword ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-register-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.page.html',
  styleUrl: './register.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterPage {
  private readonly fb = inject(FormBuilder);
  private readonly availableCardImages = ['/Bakugo.png', '/Hinata.png', '/Levi.png', '/Momo.png'];
  private readonly backgroundCardCount = 10;

  protected readonly submitAttempted = signal(false);
  protected readonly backgroundCardImages = this.createBackgroundImages();

  protected readonly registerForm = this.fb.group(
    {
      username: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(3)]),
      email: this.fb.nonNullable.control('', [Validators.required, Validators.email]),
      password: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: this.fb.nonNullable.control('', [Validators.required]),
    },
    { validators: matchingPasswords }
  );

  protected readonly showErrors = computed(() => this.submitAttempted() || this.registerForm.touched);

  protected submit(): void {
    this.submitAttempted.set(true);

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    // Placeholder while backend auth is not connected yet.
    console.log('Register payload', this.registerForm.getRawValue());
  }

  private createBackgroundImages(): string[] {
    const source = this.availableCardImages.length > 0 ? this.availableCardImages : ['/Hinata.png'];
    const images: string[] = [];

    for (let index = 0; index < this.backgroundCardCount; index += 1) {
      const image = source[Math.floor(Math.random() * source.length)];
      images.push(image);
    }

    return images;
  }
}
