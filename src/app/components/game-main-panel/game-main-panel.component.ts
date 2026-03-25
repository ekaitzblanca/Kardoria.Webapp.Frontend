import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-game-main-panel',
  templateUrl: './game-main-panel.component.html',
  styleUrl: './game-main-panel.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameMainPanelComponent {
}
