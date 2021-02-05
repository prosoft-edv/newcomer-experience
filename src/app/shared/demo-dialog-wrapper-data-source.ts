import { MatDialogRef } from '@angular/material/dialog';
import { IPsButton, IPsException } from '@prosoft/components/core';
import { IPsDialogWrapperDataSource } from '@prosoft/components/dialog-wrapper';
import { Observable, Subject, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

export const enum DemoDialogWrapperAction {
  action = 1,
  cancel = 2,
}

export interface DemoDialogWrapperDataOut<TDataOut> {
  action: DemoDialogWrapperAction;
  saveResult: TDataOut | undefined;
}

export interface DemoDialogWrapperDataSourceOptions<TDataOut, TDataIn = never> {
  dialogRef: MatDialogRef<unknown, DemoDialogWrapperDataOut<TDataOut>>;
  dialogTitle?: string;
  btnConfigFn?: (btns: {
    action: IPsButton;
    cancel: IPsButton;
  }) => void;
  loadFn?: () => Observable<TDataIn>;
  actionFn: (data: TDataIn | null) => Observable<TDataOut>;
}

export class DemoDialogWrapperDataSource<TDataOut, TDataIn = never> implements IPsDialogWrapperDataSource {
  public get dialogTitle(): string | null {
    return this.options.dialogTitle ?? null;
  }
  public buttons: IPsButton[] = [];
  public get contentVisible(): boolean {
    return !this.hasLoadError;
  }
  public get contentBlocked(): boolean {
    return this.loading || this.saving || this.blockView;
  }
  public loadedData: TDataIn | null = null;
  public exception: IPsException | null = null;

  private loading = false;
  private hasLoadError = false;
  private saving = false;
  private blockView = false;
  private defaultOkDisabled = false;

  public defaultButtons = {
    action: {
      label: 'Ok',
      type: 'raised',
      color: 'primary',
      disabled: () => this.contentBlocked || this.defaultOkDisabled,
      click: () => this.confirm(),
    } as IPsButton,
    cancel: {
      label: 'Cancel',
      type: 'stroked',
      color: undefined,
      disabled: () => false,
      click: () => this.close(),
    } as IPsButton,
  };
  private stateChanges$ = new Subject<void>();
  private loadingSubscription = Subscription.EMPTY;
  private connectSubscription = Subscription.EMPTY;

  constructor(private options: DemoDialogWrapperDataSourceOptions<TDataOut, TDataIn>) {
    if (this.options.btnConfigFn) {
      this.options.btnConfigFn(this.defaultButtons);
    }
    this.buttons = [this.defaultButtons.action, this.defaultButtons.cancel];
  }
  public connect(): Observable<void> {
    this.loadData();
    return this.stateChanges$;
  }

  public disconnect(): void {
    this.loadingSubscription.unsubscribe();
    this.connectSubscription.unsubscribe();
    if (this.stateChanges$) {
      this.stateChanges$.complete();
      this.stateChanges$ = new Subject<void>();
    }
  }

  public setDefaultOkDisabled(disabled: boolean): void {
    this.defaultOkDisabled = disabled;
    if (this.stateChanges$) {
      this.stateChanges$.next();
    }
  }

  public setViewBlocked(value: boolean): void {
    this.blockView = value;
    this.stateChanges$.next();
  }

  public confirm(): void {
    this.saving = true;
    this.exception = null;
    this.stateChanges$.next();

    this.options
      .actionFn(this.loadedData)
      .pipe(take(1))
      .subscribe({
        next: (saveResult) => {
          this.closeDialog(DemoDialogWrapperAction.action, saveResult);
        },
        error: (err) => {
          this.saving = false;
          this.setError(err);
          this.stateChanges$.next();
        },
      });
  }

  public close(): void {
    this.closeDialog(DemoDialogWrapperAction.cancel);
  }

  private loadData(): void {
    this.loadingSubscription.unsubscribe();
    this.loadedData = null;
    this.hasLoadError = false;
    this.exception = null;
    this.stateChanges$.next();

    if (!this.options.loadFn) {
      return;
    }

    this.loading = true;
    this.loadingSubscription = this.options
      .loadFn()
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          this.loadedData = data;
          this.loading = false;
          this.stateChanges$.next();
        },
        error: (err) => {
          this.loading = false;
          this.hasLoadError = true;
          this.setError(err);
          this.stateChanges$.next();
        },
      });
  }

  private closeDialog(actionResult: DemoDialogWrapperAction, saveResult?: TDataOut): void {
    this.options.dialogRef.close({
      action: actionResult,
      saveResult,
    });
  }

  private setError(err: unknown): void {
    this.exception = {
      errorObject: err,
    };
  }
}
