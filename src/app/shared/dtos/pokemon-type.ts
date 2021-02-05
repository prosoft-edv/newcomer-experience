import { IListItem } from './list-item';

export interface IPokemonType {
  /** The order the Pokémon's types are listed in. */
  slot: number;
  /** The type the referenced Pokémon has. */
  type: IListItem;
}
