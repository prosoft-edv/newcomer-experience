import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { PsCardModule } from '@prosoft/components/card';

/**
 * Exports modules that are used by multiple different other modules to remove import cluster.
 * Attention: Everything exported by this module cannot be lazy loaded.
 */
@NgModule({
  exports: [CommonModule, HttpClientModule, MatButtonModule, PsCardModule, RouterModule],
})
export class SharedModule {}
