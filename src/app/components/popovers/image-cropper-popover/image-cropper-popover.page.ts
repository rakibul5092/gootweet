import { Component, OnInit } from "@angular/core";
import { NavParams } from "@ionic/angular";
import { base64ToFile, ImageCroppedEvent } from "ngx-image-cropper";
import { ModalService } from "src/app/services/modal.service";

@Component({
  selector: "app-image-cropper-popover",
  templateUrl: "./image-cropper-popover.page.html",
  styleUrls: ["./image-cropper-popover.page.scss"],
})
export class ImageCropperPopoverPage implements OnInit {
  imageEvent: any = null;
  croppedImage: string;
  file: Blob;
  ratioX = 0;
  ratioY = 0;
  constructor(
    private modalService: ModalService,
    private navParams: NavParams
  ) {}

  ngOnInit() {
    if (this.navParams.data) {
      this.imageEvent = this.navParams.get("imageevent");
      this.ratioX = this.navParams.get("ratiox");
      this.ratioY = this.navParams.get("ratioy");
    }
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.file = base64ToFile(event.base64);
  }

  save() {
    this.modalService.dismiss({
      file: this.file,
      base64: this.croppedImage,
    });
  }

  close() {
    this.file = null;
    this.croppedImage = null;
    this.modalService.dismiss();
  }
}
