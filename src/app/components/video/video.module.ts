import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SanitizeVideoModule } from 'src/app/pipes/share-module/sanitize-video.module';
import { VideoComponent } from './video.component';



@NgModule({
  declarations: [VideoComponent],
  imports: [
    CommonModule,
    RouterModule,
    SanitizeVideoModule,
    IonicModule
  ],
  exports: [VideoComponent],

})
export class VideoModule { }
