import { HttpClient } from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { mapTo } from 'rxjs/operators';

import { IPokemon } from '../dtos/pokemon';

export function httpSavePokemon(_: HttpClient, pokemon: IPokemon): Observable<void> {
  if (pokemon.name.toLowerCase() === 'missingno') {
    return throwError(`Don't you use glitches!`);
  }

  return timer(1500).pipe(mapTo(void 0));
}
