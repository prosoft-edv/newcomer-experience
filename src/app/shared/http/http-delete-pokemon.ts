import { HttpClient } from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { switchMapTo } from 'rxjs/operators';

export function httpDeletePokemon(_: HttpClient, __: (string | number)[]): Observable<void> {
  return timer(1000).pipe(switchMapTo(throwError(`You no delete Pokémon!`)));
}
