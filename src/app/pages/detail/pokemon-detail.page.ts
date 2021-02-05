import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';

import { DemoFormDataSource } from '../../shared/demo-form-data-source';
import { IPokemon } from '../../shared/dtos/pokemon';
import { httpGetPokemon } from '../../shared/http/http-get-pokemon';
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
      name: new FormControl(null, [Validators.required, Validators.minLength(1)]),
      weight: new FormControl(null, Validators.min(0.1)),
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
            height: pokemon.height / 10,
            weight: pokemon.weight / 10,
          };
        })
      ),
    saveFn: (formValue) => {
      formValue.height = formValue.height * 10;
      formValue.weight = formValue.weight * 10;
      return httpSavePokemon(this.http, formValue);
    },
    navigateFn: (ctx) => {
      if (ctx.close) {
        this.router.navigate(['..'], { relativeTo: this.route });
      }
    },
  });

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}
}
