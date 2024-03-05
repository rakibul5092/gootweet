import { Injectable } from "@angular/core";
import { ModalController } from "@ionic/angular";

@Injectable({
  providedIn: "root",
})
export class ModalService {
  constructor(private modalController: ModalController) {}
  dismiss(data?: any) {
    if (data) {
      return this.modalController.dismiss(data);
    } else {
      return this.modalController.dismiss();
    }
  }
  async presentModal(
    component: any,
    props: any,
    cssClass: string,
    mode: any,
    swipeToClose = true
  ) {
    const modal = await this.modalController.create({
      component: component,
      animated: true,
      componentProps: props,
      cssClass: cssClass,
      keyboardClose: true,
      swipeToClose: swipeToClose,
      mode: mode,
      backdropDismiss: true,
    });
    return await modal.present();
  }
  async createModal(component: any, props: any, cssClass: string, mode: any) {
    return await this.modalController.create({
      component: component,
      animated: true,
      componentProps: props,
      cssClass: cssClass,
      keyboardClose: true,
      swipeToClose: true,
      mode: mode,
      backdropDismiss: true,
    });
  }
}
