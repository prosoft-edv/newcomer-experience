import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DefaultPsSelectDataSource, PsSelectLoadTrigger, PsSelectSortBy } from '@prosoft/components/select';
import { map } from 'rxjs/operators';

import { DemoFormDataSource } from '../../shared/demo-form-data-source';
import { IPokemon } from '../../shared/dtos/pokemon';
import { httpGetPokemon } from '../../shared/http/http-get-pokemon';
import { httpGetTypeList } from '../../shared/http/http-get-type-list';
import { httpSavePokemon } from '../../shared/http/http-save-pokemon';

@Component({
  selector: 'app-pokemon-detail-page',
  templateUrl: './pokemon-detail.page.html',
  styleUrls: ['./pokemon-detail.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonDetailPage {
  public pokemon: IPokemon;
  public nextId: number;
  public fds = new DemoFormDataSource({
    form: new FormGroup({
      height: new FormControl(null, Validators.min(0.1)),
      id: new FormControl(null, [Validators.required, Validators.min(1)]),
      name: new FormControl(null, [
        Validators.required,
        Validators.minLength(1),
      ]),
      weight: new FormControl(null, Validators.min(0.1)),
      types: new FormControl(null, getTypeValidatorFn()),
    }),
    loadTrigger$: this.route.paramMap.pipe(
      map((params) => params.get('nameOrId'))
    ),
    loadFn: (nameOrId: string | number) =>
      httpGetPokemon(this.http, nameOrId).pipe(
        map((pokemon) => {
          this.pokemon = pokemon;
          this.nextId = Math.floor(Math.random() * 898) + 1;
          return {
            ...pokemon,
            types: pokemon.types
              .sort((a, b) => a.slot - b.slot)
              .map((x) => x.type),
            height: pokemon.height / 10,
            weight: pokemon.weight / 10,
          };
        })
      ),
    saveFn: (formValue) => {
      formValue.height = formValue.height * 10;
      formValue.weight = formValue.weight * 10;
      return httpSavePokemon(this.http, {
        ...formValue,
        height: formValue.height * 10,
        weight: formValue.weight * 10,
        types: formValue.types.map((item, index) => ({
          slot: index + 1,
          type: item,
        })),
      });
    },
    navigateFn: (ctx) => {
      if (ctx.close) {
        this.router.navigate(['..'], { relativeTo: this.route });
      }
    },
  });

  // Ps-select items for both configuration types.
  public types$ = httpGetTypeList(this.http);

  // Ps-select datasource defined in the .ts with all possible options.
  // Functions like sortCompare can be overwritten in the constructor/ngOnInit.
  public typeDS = new DefaultPsSelectDataSource({
    mode: 'entity',
    idKey: 'name',
    labelKey: 'name',
    items: this.types$,
    // You can provide the name of a property that indicates whether the item should be disabled
    disabledKey: '_',
    // Initial is required for mode 'id', the other load triggers only work properly with mode 'entity'
    loadTrigger: PsSelectLoadTrigger.FirstPanelOpen,
    searchDebounce: 300,
    // 'Selected' - Moves the selected items to the top
    // 'Comparer' - Uses the sortCompare method for sorting. Sorts by 'labelKey' ascending if it is not overwritten
    // 'Both'     - Combination of 'Selected', then 'Comparer'
    // 'None'     - No sorting applied
    sortBy: PsSelectSortBy.Both
  });

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}
}

function getTypeValidatorFn(): ValidatorFn {
  return (control: AbstractControl) => {
    if (control.value?.length > 2) {
      return { type_validator: { Message: 'You should not select more than two types.' } };
    }
    if (control.value?.length === 0) {
      return { type_validator: { Message: 'You must select at least one type.' } };
    }

    return null;
  };
}
