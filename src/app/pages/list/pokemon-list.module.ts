import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { PsDialogWrapperModule } from '@prosoft/components/dialog-wrapper';
import { PsTableModule } from '@prosoft/components/table';

import { SharedModule } from '../../shared/shared.module';
import { ConfirmDeleteDialog } from './dialogs/confirm-delete.dialog';
import { PokemonListPage } from './pokemon-list.page';



@NgModule({
  imports: [
    MatDialogModule,
    MatIconModule,
    MatMenuModule,
    PsDialogWrapperModule,
    PsTableModule,
    SharedModule
  ],
  exports: [PokemonListPage],
  declarations: [ConfirmDeleteDialog, PokemonListPage],
})
export class PokemonListModule { }
