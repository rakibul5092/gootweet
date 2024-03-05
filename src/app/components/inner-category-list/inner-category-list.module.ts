import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { NgPipesModule } from 'ngx-pipes';
import { InnerCategoryListComponent } from './inner-category-list.component';

@NgModule({
    declarations: [InnerCategoryListComponent],
    imports: [
        CommonModule,
        NgPipesModule,
        IonicModule,
    ],
    exports: [InnerCategoryListComponent],
})
export class InnerCategoryListModule { }
