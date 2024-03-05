import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { InnerCategoryListComponent } from "../inner-category-list/inner-category-list.component";

@Component({
  selector: "app-product-search",
  templateUrl: "./product-search.component.html",
  styleUrls: ["./product-search.component.scss"],
})
export class ProductSearchComponent {
  @Input() ownerUid: string;
  @Input() isWeb = true;
  @Output() filter = new EventEmitter<string>();
  @Output() cancel = new EventEmitter();
  searchText: string;

  constructor(private modalController: ModalController) {}

  onEnter(value) {
    if (value && value !== "") {
      this.filter.emit(value);
    }
  }

  public async openInnerCategoryModal(): Promise<void> {
    const data = { ownerUid: this.ownerUid, header: true };
    const modal = await this.modalController.create({
      component: InnerCategoryListComponent,
      componentProps: data,
      breakpoints: [0, 0.25, 0.5, 0.75, 1],
      initialBreakpoint: 0.75,
      animated: true,
      mode: "ios",
      keyboardClose: true,
    });

    await modal.present();
  }
}
