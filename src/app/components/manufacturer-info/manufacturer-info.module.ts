import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { NgPipesModule } from 'ngx-pipes';
import { ManufacturerInfoComponent } from './manufacturer-info.component';
import { SanitizeImagePipeModule } from 'src/app/pipes/share-module/sanitize-image-pipe/sanitize-image-pipe.module';

@NgModule({
    declarations: [ManufacturerInfoComponent],
    imports: [
        CommonModule,
        NgPipesModule,
        IonicModule,
        SanitizeImagePipeModule
    ],
    exports: [ManufacturerInfoComponent],
})
export class ManufacturerInfoModule { }
