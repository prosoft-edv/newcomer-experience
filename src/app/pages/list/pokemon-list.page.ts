import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PsTableDataSource } from '@prosoft/components/table';
import { map } from 'rxjs/operators';

import { DemoDialogWrapperAction, DemoDialogWrapperDataOut } from '../../shared/demo-dialog-wrapper-data-source';
import { IListItem } from '../../shared/dtos/list-item';
import { httpGetPokemonList } from '../../shared/http/http-get-pokemon-list';
import { ConfirmDeleteDialog, ConfirmDeleteDialogDataIn } from './dialogs/confirm-delete.dialog';

@Component({
  selector: 'app-pokemon-list-page',
  templateUrl: './pokemon-list.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonListPage {
  public get tds(): PsTableDataSource<IListItem> {
    return this._clientTds;
  }

  /**
   * TableDataSource with server side filtering.
   * Search and sort are not working with this solution as the Pokémon API does not provide this functionality.
   * To test this, exchange the return value of the tds getter with this datasource.
   */
  private _serverTds = new PsTableDataSource(
    (updateInfo) =>
      httpGetPokemonList(this.http, {
        limit: updateInfo.pageSize,
        offset: updateInfo.currentPage * updateInfo.pageSize,
      }).pipe(
        map((result) => ({
          items: result.results,
          totalItems: result.count,
        }))
      ),
    'server'
  );

  /** TableDataSource with client side filtering */
  private _clientTds = new PsTableDataSource(() =>
    httpGetPokemonList(this.http, {
      limit: 1118,
      offset: 0,
    }).pipe(map((result) => result.results))
  );

  constructor(private http: HttpClient, private dialog: MatDialog) {}

  public delete(rows: IListItem[]): void {
    this.dialog
      .open<
        ConfirmDeleteDialog,
        ConfirmDeleteDialogDataIn,
        DemoDialogWrapperDataOut<void>
      >(ConfirmDeleteDialog, { data: { ids: rows.map((x) => x.id) } })
      .afterClosed()
      .subscribe((result) => {
        if (result.action === DemoDialogWrapperAction.action) {
          this.tds.updateData();
        }
      });
  }
}
