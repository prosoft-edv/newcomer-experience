import { FormGroup } from '@angular/forms';
import { IPsButton, IPsException } from '@prosoft/components/core';
import { IPsFormDataSource } from '@prosoft/components/form';
import { IPsSavebarMode } from '@prosoft/components/savebar';
import { Observable, of, Subject, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

export interface DemoFormDataSourceOptions<TParams, TData, TSaveResponse> {
  form: FormGroup;
  loadTrigger$?: Observable<TParams>;
  loadFn?: (params: TParams | null) => Observable<TData>;
  saveFn: (data: TData, params: TParams | null) => Observable<TSaveResponse>;
  navigateFn?: (
    ctx:
      | { close: boolean; save: false }
      | {
          close: boolean;
          save: true;
          savedData: TData;
          saveResponse: TSaveResponse;
        }
  ) => void;
  btnConfigFn?: (btns: {
    save: IPsButton;
    saveAndClose: IPsButton;
    cancel: IPsButton;
  }) => void;
}

export class DemoFormDataSource<TParams, TData, TSaveResponse> implements IPsFormDataSource {
  public autocomplete: 'off' | 'on' = 'off';
  public get form(): FormGroup {
    return this.options.form;
  }
  public buttons: IPsButton[] = [];
  public get contentVisible(): boolean {
    return !this._hasLoadError;
  }
  public get contentBlocked(): boolean {
    return this._loading || this._saving || this._blockView;
  }
  public exception: IPsException | null = null;
  public get savebarMode(): IPsSavebarMode {
    return 'auto';
  }

  private _loading = false;
  private _hasLoadError = false;
  private _saving = false;
  private _blockView = false;
  private stateChanges$!: Subject<void>;
  private _loadParams: TParams | null = null;

  private buttonDefs = {
    save: {
      label: 'Save',
      type: 'raised',
      color: 'primary',
      disabled: () =>
        this.contentBlocked || !this.form.valid || this.form.pristine,
      click: () => this.save(false),
    } as IPsButton,
    saveAndClose: {
      label: 'Save & close',
      type: 'raised',
      color: 'primary',
      disabled: () =>
        this.contentBlocked || !this.form.valid || this.form.pristine,
      click: () => this.save(true),
    } as IPsButton,
    cancel: {
      label: 'Cancel',
      type: 'stroked',
      color: undefined,
      disabled: () => false,
      click: () => this.close(),
    } as IPsButton,
  };

  private _loadingSub = Subscription.EMPTY;
  private _connectSub = Subscription.EMPTY;
  constructor(
    private options: DemoFormDataSourceOptions<TParams, TData, TSaveResponse>
  ) {
    if (options.btnConfigFn) {
      options.btnConfigFn(this.buttonDefs);
    }
  }

  public connect(): Observable<void> {
    this.stateChanges$ = new Subject<void>();
    const loadTrigger$: Observable<TParams | null> = this.options.loadTrigger$ || of(null);
    this._connectSub = loadTrigger$.subscribe(
      (params) => {
        this._loadParams = params;
        this.loadData(params);
      }
    );
    return this.stateChanges$;
  }

  public disconnect(): void {
    this._connectSub.unsubscribe();
    this.stateChanges$.complete();
    this.stateChanges$ = new Subject();
  }

  public setViewBlocked(value: boolean): void {
    this._blockView = value;
    this.stateChanges$.next();
  }

  public save(close: boolean): void {
    this._saving = true;
    this.exception = null;
    this.updateButtons();
    this.stateChanges$.next();

    const formValue: TData = this.form.getRawValue();
    this.options
      .saveFn(formValue, this._loadParams)
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          if (this.options.navigateFn) {
            this.options.navigateFn({
              close,
              save: true,
              savedData: formValue,
              saveResponse: data,
            });
          }
          this._saving = false;
          this.form.markAsPristine();
          this.form.updateValueAndValidity();
          this.updateButtons();
          this.stateChanges$.next();
        },
        error: (err) => {
          this._saving = false;
          this.exception = {
            errorObject: err,
          };
          this.updateButtons();
          this.stateChanges$.next();
        },
      });
  }

  public close(): void {
    if (this.options.navigateFn) {
      this.options.navigateFn({
        close: true,
        save: false,
      });
    }
  }

  private loadData(params: TParams | null): void {
    this.form.disable();
    this._loadingSub.unsubscribe();
    this._loading = true;
    this._hasLoadError = false;
    this.exception = null;
    this.updateButtons();
    this.stateChanges$.next();

    this._loadingSub = (this.options.loadFn
      ? this.options.loadFn(params)
      : of({})
    )
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          this.form.enable();
          this.form.reset(data);
          this._loading = false;
          this.updateButtons();
          this.stateChanges$.next();
        },
        error: (err) => {
          this._loading = false;
          this._hasLoadError = true;
          this.exception = {
            errorObject: err,
            alignCenter: true,
            icon: 'sentiment_very_dissatisfied',
          };
          this.updateButtons();
          this.stateChanges$.next();
        },
      });
  }

  private updateButtons(): void {
    this.buttons = [];
    if (this.contentVisible) {
      if (this.buttonDefs.save) {
        this.buttons.push(this.buttonDefs.save);
      }
      if (this.buttonDefs.saveAndClose) {
        this.buttons.push(this.buttonDefs.saveAndClose);
      }
    }

    if (this.buttonDefs.cancel) {
      this.buttons.push(this.buttonDefs.cancel);
    }
  }
}
