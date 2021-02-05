import { IPokemonSprites } from './pokemon-sprites';
import { IPokemonType } from './pokemon-type';
import { IVersionGameIndex } from './version-game-index';

export interface IPokemon {
  /** A list of game indices relevent to Pokémon item by generation. */
  game_indices: IVersionGameIndex[];
  /** The height of this Pokémon in decimetres. */
  height: number;
  /** The identifier for this resource. */
  id: number;
  /** The name for this resource. */
  name: string;
  /** A set of sprites used to depict this Pokémon in the game.
   * A visual representation of the various sprites can be found at PokeAPI/sprites
   */
  sprites: IPokemonSprites;
  /** A list of details showing types this Pokémon has. */
  types: IPokemonType[];
  /** The weight of this Pokémon in hectograms. */
  weight: number;
}
