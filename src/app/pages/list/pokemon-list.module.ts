import { NgModule } from '@angular/core';
import { PsTableModule } from '@prosoft/components/table';

import { SharedModule } from '../../shared/shared.module';
import { PokemonListPage } from './pokemon-list.page';



@NgModule({
  imports: [PsTableModule, SharedModule],
  exports: [PokemonListPage],
  declarations: [PokemonListPage],
})
export class PokemonListModule { }
