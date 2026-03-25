import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink],
  templateUrl: './home.page.html',
  styleUrl: './home.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
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

  protected readonly leftMainImage = '/cards/003.png';
  protected readonly centerMainImage = '/cards/001.png';
  protected readonly rightMainImage = '/cards/002.png';

  protected readonly backgroundCardImages = this.createBackgroundImages();

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
