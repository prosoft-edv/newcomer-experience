import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { PsNumberInputModule } from '@prosoft/components/number-input';
import { PsFormModule } from '@prosoft/components/form';
import { PsFormFieldModule } from '@prosoft/components/form-field';
import { SharedModule } from 'src/app/shared/shared.module';

import { PokemonSpriteComponent } from './components/pokemon-sprite.component';
import { PokemonDetailPage } from './pokemon-detail.page';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    MatCardModule,
    MatInputModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: PokemonDetailPage
      }
    ]),
    PsNumberInputModule,
    PsFormModule,
    PsFormFieldModule,
    SharedModule
  ],
  declarations: [PokemonDetailPage, PokemonSpriteComponent],
})
export class PokemonDetailModule { }
