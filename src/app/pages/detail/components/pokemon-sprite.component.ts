import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { IPokemon } from '../../../shared/dtos/pokemon';

/**
 * This component uses inline template and styles to show how this is done.
 * The preferred solution is to create .html and .scss files.
 */
@Component({
  selector: 'app-pokemon-sprite',
  template: `
    <div class="app-pokemon-sprite__container">
      <b>Default</b>
      <img [src]="pokemon?.sprites?.front_default" />
      <b>Shiny</b>
      <img [src]="pokemon?.sprites?.front_shiny" />
    </div>
  `,
  styles: [
    `
      .app-pokemon-sprite__container {
        display: grid;
        grid-template-rows: auto 1fr;
        grid-auto-flow: column;
        grid-auto-columns: max-content;
        gap: 0 1em;
        text-align: center;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PokemonSpriteComponent {
  @Input() pokemon: IPokemon;
}
