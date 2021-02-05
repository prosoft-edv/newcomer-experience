import { Injectable } from '@angular/core';
import { IPsTableSetting, PsTableSettingsService } from '@prosoft/components/table';
import { Observable, of, Subject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class DemoTableSettingsService extends PsTableSettingsService {
  private savedSettings = new Map<string, IPsTableSetting>();
  private _emitStream = new Subject<void>();

  constructor() {
    super();
    this.settingsEnabled = true;
  }

  public getStream(
    tableId: string,
    onlySaved: boolean
  ): Observable<IPsTableSetting> {
    return this._emitStream.pipe(
      startWith(null as unknown),
      map(() => {
        const savedSetting = this.savedSettings.get(tableId);
        return (!savedSetting && !onlySaved
          ? { pageSize: 25 }
          : savedSetting) as IPsTableSetting;
      })
    );
  }

  public save(tableId: string, settings: IPsTableSetting): Observable<void> {
    this.savedSettings.set(tableId, settings);
    this._emitStream.next();
    return of(undefined);
  }
}
