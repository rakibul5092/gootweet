import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfilePhotoComponent } from './profile-photo.component';
import { SanitizeImagePipeModule } from 'src/app/pipes/share-module/sanitize-image-pipe/sanitize-image-pipe.module';



@NgModule({
  declarations: [ProfilePhotoComponent],
  imports: [
    CommonModule,
    SanitizeImagePipeModule
  ],
  exports: [ProfilePhotoComponent]
})
export class ProfilePhotoModule { }
