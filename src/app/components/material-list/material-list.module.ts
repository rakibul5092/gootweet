import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialListComponent } from './material-list.component';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { NgPipesModule } from 'ngx-pipes';
import { GetImageModule } from 'src/app/pipes/share-module/get-image/get-image.module';

@NgModule({
  declarations: [MaterialListComponent],
  imports: [CommonModule, LazyLoadImageModule, NgPipesModule, GetImageModule],
  exports: [MaterialListComponent],
})
export class MaterialListModule {}
