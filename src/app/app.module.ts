import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { PsIntlService, PsIntlServiceEn } from '@prosoft/components/core';
import { PsFormService } from '@prosoft/components/form-base';
import { DefaultPsSelectService, PsSelectService } from '@prosoft/components/select';
import { PsTableSettingsService } from '@prosoft/components/table';

import { AppComponent } from './app.component';
import { DemoFormService } from './shared/demo-form.service';
import { DemoTableSettingsService } from './shared/demo-table-settings.service';

const routes: Routes = [];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes, {
      paramsInheritanceStrategy: 'always',
      relativeLinkResolution: 'corrected',
      scrollPositionRestoration: 'disabled'
    })
  ],
  providers: [
    { provide: PsIntlService, useClass: PsIntlServiceEn },
    { provide: PsTableSettingsService, useClass: DemoTableSettingsService },
    { provide: PsFormService, useClass: DemoFormService },
    { provide: PsSelectService, useClass: DefaultPsSelectService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
