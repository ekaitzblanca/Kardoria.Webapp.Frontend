import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-game-footer',
  templateUrl: './game-footer.component.html',
  styleUrl: './game-footer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameFooterComponent {
}
