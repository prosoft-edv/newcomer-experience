import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { IListResult } from '../dtos/list-result';
import { toQueryString } from './to-query-string';

export function httpGetPokemonList(
  http: HttpClient,
  queryParams: { limit: number; offset: number }
): Observable<IListResult> {
  return http
    .get<IListResult>(
      'https://pokeapi.co/api/v2/pokemon/?' + toQueryString(queryParams)
    )
    .pipe(
      tap((result) => {
        result.results.forEach((pokemon) => {
          const splitUrl = pokemon.url.split('/');
          pokemon.id = +splitUrl[splitUrl.length - 2];
        });
      })
    );
}
