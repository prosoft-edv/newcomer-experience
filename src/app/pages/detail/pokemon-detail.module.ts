import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { PsFormModule } from '@prosoft/components/form';
import { PsFormFieldModule } from '@prosoft/components/form-field';
import { PsNumberInputModule } from '@prosoft/components/number-input';
import { PsSelectModule } from '@prosoft/components/select';
import { SharedModule } from 'src/app/shared/shared.module';

import { PokemonSpriteComponent } from './components/pokemon-sprite.component';
import { PokemonDetailPage } from './pokemon-detail.page';

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
    PsSelectModule,
    SharedModule
  ],
  declarations: [PokemonDetailPage, PokemonSpriteComponent],
})
export class PokemonDetailModule { }
