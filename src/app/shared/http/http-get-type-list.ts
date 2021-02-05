import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IListItem } from '../dtos/list-item';

import { IListResult } from '../dtos/list-result';

export function httpGetTypeList(http: HttpClient): Observable<IListItem[]> {
  return http.get<IListResult>('https://pokeapi.co/api/v2/type/').pipe(
    map((result) =>
      result.results.map((type) => {
        const splitUrl = type.url.split('/');
        return {
          ...type,
          id: +splitUrl[splitUrl.length - 2],
        };
      })
    )
  );
}
