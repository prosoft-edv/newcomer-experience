import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { timer } from 'rxjs';

import { DemoDialogWrapperDataOut, DemoDialogWrapperDataSource } from '../../../shared/demo-dialog-wrapper-data-source';
import { httpDeletePokemon } from '../../../shared/http/http-delete-pokemon';



@Component({
  selector: 'app-confirm-delete-dialog',
  templateUrl: './confirm-delete.dialog.html',
  styleUrls: ['./confirm-delete.dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmDeleteDialog {
  public spriteUrls: string[];
  public dwds = new DemoDialogWrapperDataSource({
    dialogRef: this.dialogRef,
    dialogTitle: 'Do you really want to delete those cute critters?',
    actionFn: () => httpDeletePokemon(this.http, this.data.ids),
    loadFn: () => {
      this.spriteUrls = this.data.ids.map(id => {
        const shiny = Math.random() < 0.01 ? 'shiny/' : '';
        return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${shiny}/${id}.png`;
      });
      return timer(1000);
    }
  });

  constructor(
    private dialogRef: MatDialogRef<ConfirmDeleteDialog, DemoDialogWrapperDataOut<void>>,
    @Inject(MAT_DIALOG_DATA) private data: ConfirmDeleteDialogDataIn,
    private http: HttpClient,
  ) { }
}

export interface ConfirmDeleteDialogDataIn {
  ids: number[];
}
