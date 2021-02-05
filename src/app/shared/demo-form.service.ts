import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BasePsFormService, IPsFormError, IPsFormErrorData } from '@prosoft/components/form-base';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DemoFormService extends BasePsFormService {
  constructor() {
    super();
    this.tryDetectRequired = false;
  }

  protected mapDataToError(errorData: IPsFormErrorData[]): Observable<IPsFormError[]> {
    if (!errorData.length) {
      return of([]);
    }

    return of(errorData.map(error => ({ data: error, errorText: mapErrorToText(error) })));
  }

  public filterErrors(errorData: IPsFormErrorData[], _: boolean, source: 'form' | 'control'): Observable<IPsFormErrorData[]> {
    const requiredErrorExists = errorData.some(error => error.errorKey === 'required');
    const controlErrorExists = errorData.some(error => error.isControl);
    let errorDataCopy = [...errorData];
    errorDataCopy = errorDataCopy
      .filter(error => error.errorKey !== 'required')
      .filter(error => !error.errorKey.startsWith('group_error_member_'));

    if (source === 'form') {
      errorDataCopy = errorDataCopy.filter(x => !x.isControl);
      if (requiredErrorExists || controlErrorExists) {
        errorDataCopy.push({
          controlPath: '',
          errorKey: 'some_controls_required',
          errorValue: {
              Message: 'Please fill in all required values.',
          },
          isControl: false,
        });
      }
    }

    return of(errorDataCopy);
  }

  getLabel(_: FormControl): Observable<string> | null {
    return null;
  }
}

function mapErrorToText(error: IPsFormErrorData): string {
  const errorValue = error.errorValue;
  if (errorValue?.Message) {
    return errorValue.Message;
  }

  switch (error.errorKey) {
    case 'email':
      return 'Please provide a valid email address.';
    case 'max':
      return `Value must not be greater than ${errorValue.max}.`;
    case 'maxlength':
      return `Length must not exceed ${errorValue.requiredLength} characters.`;
    case 'min':
      return `Value must not be lower than ${errorValue.min}.`;
    case 'minlength':
      return `Length must be at least ${errorValue.requiredLength} characters.`;
    case 'pattern':
      return `Please match the following pattern: ${errorValue.pattern}`;
    default:
      return 'Please provide a valid value. Key: ' + error.errorKey;
  }
}
