import { InViewService } from './ngx-in-view.service';
import { InViewDirective } from './ngx-in-view.directive';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    InViewDirective
  ],
  exports: [
     InViewDirective
  ]
})
export class InViewModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: InViewModule,
      providers: [InViewService]
    };
  }
}
