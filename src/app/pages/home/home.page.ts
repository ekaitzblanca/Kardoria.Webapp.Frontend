import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home.page.html',
  styleUrl: './home.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
  private readonly availableCardImages = ['/Bakugo.png', '/Hinata.png', '/Levi.png', '/Momo.png'];
  private readonly backgroundCardCount = 10;

  protected readonly leftMainImage = '/Levi.png';
  protected readonly centerMainImage = '/Bakugo.png';
  protected readonly rightMainImage = '/Hinata.png';

  protected readonly backgroundCardImages = this.createBackgroundImages();

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
