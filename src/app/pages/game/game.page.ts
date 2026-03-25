import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { GameFooterComponent } from '../../components/game-footer/game-footer.component';
import { GameHeaderComponent } from '../../components/game-header/game-header.component';
import { GameMenuComponent } from '../../components/game-menu/game-menu.component';

@Component({
  selector: 'app-game-page',
  imports: [GameHeaderComponent, GameFooterComponent, GameMenuComponent, RouterOutlet],
  templateUrl: './game.page.html',
  styleUrl: './game.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GamePage {
}
