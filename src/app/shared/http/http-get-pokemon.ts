import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IPokemon } from '../dtos/pokemon';

export function httpGetPokemon(http: HttpClient, nameOrId: string | number): Observable<IPokemon> {
  return http.get<IPokemon>('https://pokeapi.co/api/v2/pokemon/' + nameOrId);
}
