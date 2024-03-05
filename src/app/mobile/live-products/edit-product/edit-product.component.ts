import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { IonInput } from "@ionic/angular";
import { Subject, map, takeUntil } from "rxjs";
import { LIVE_STREAMINGS_PRODUCT_PHOTO_BASE } from "src/app/constants";
import { AddProductService } from "src/app/home-main/manufacturer/products/product-information/add-product.service";
import { LiveProduct } from "src/app/models/product";
import { User } from "src/app/models/user";
import { getTimestamp } from "src/app/services/functions/functions";
import { LiveStreamingService } from "src/app/services/live-streaming.service";
import { UtilityService } from "src/app/services/utility.service";

@Component({
  selector: "app-edit-product",
  templateUrl: "./edit-product.component.html",
  styleUrls: ["./edit-product.component.scss"],
})
export class EditProductComponent implements OnInit, OnChanges {
  @Input() openEditModal = false;
  @Input() product: LiveProduct;
  @Input() me: User;
  @Output() onDone = new EventEmitter();
  public liveProductForm: FormGroup;
  public liveProductPhotoBaseUrl = LIVE_STREAMINGS_PRODUCT_PHOTO_BASE;
  public sizes: { id: string; name: string; selected: boolean }[] = [];
  public colors: { id: string; name: string; selected: boolean }[] = [];
  private destroy$ = new Subject();

  constructor(
    private fb: FormBuilder,
    private utils: UtilityService,
    private streamService: LiveStreamingService,
    private addProductService: AddProductService
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (this.product) {
      if (this.me) {
        this.addProductService
          .getAllColorsOrSizes(this.me.uid, false)
          .pipe(
            takeUntil(this.destroy$),
            map((actions) => {
              return actions.map((a) => {
                return { ...a, selected: false };
              });
            })
          )
          .subscribe((data) => {
            this.sizes = data;
          });
        this.addProductService
          .getAllColorsOrSizes(this.me.uid, true)
          .pipe(
            takeUntil(this.destroy$),
            map((actions) => {
              return actions.map((a) => {
                return { ...a, selected: false };
              });
            })
          )
          .subscribe((data) => {
            this.colors = data;
          });
      }
      this.liveProductForm = this.fb.group({
        id: ["", Validators.required],
        liveId: ["", Validators.required],
        ownerUid: ["", Validators.required],
        price: [null],
        colors: [[]],
        sizes: [[]],
        about: [""],
      });
      this.liveProductForm.patchValue(this.product);
    }
  }

  ngOnInit() {}

  async onProductInfoDone(modal) {
    if (this.liveProductForm.valid) {
      await this.utils.present("Išsaugomas...");
      await this.saveFinalData(modal);
      this.onDone.emit(null);
    } else {
      this.utils.showAlert("Reikalingas", "Prašome nustatyti kainą");
    }
  }

  async saveFinalData(modal) {
    await this.streamService.saveLiveProduct(
      {
        ...this.liveProductForm.getRawValue(),
        timestamp: getTimestamp(),
      },
      this.me,
      true,
      false
    );

    await modal?.dismiss();
    await this.utils.dismiss();
  }

  public onSaveColorsAndSizes(modal, isColor: boolean = true) {
    if (isColor) {
      this.liveProductForm
        .get("colors")
        .patchValue(
          this.colors.filter((item) => item.selected).map((item) => item.name)
        );
    } else {
      this.liveProductForm
        .get("sizes")
        .patchValue(
          this.sizes.filter((item) => item.selected).map((item) => item.name)
        );
    }
    modal.dismiss();
  }
  public async addColorOrSize(inputField: IonInput, isColor: boolean) {
    if (inputField.value !== "") {
      await this.addProductService.addColorOrSize(
        inputField.value as string,
        getTimestamp(),
        isColor,
        this.me.uid
      );
      inputField.value = "";
    }
  }

  public onDeleteColorOrSize(item: any, isColor: boolean) {
    this.addProductService.deleteColorOrSize(item, isColor, this.me.uid);
  }

  public onEditingCancel(modal) {
    modal.dismiss();
    this.onDone.emit(null);
  }
  public onPriceFocus(event) {
    if (event.target.value === 0 || event.target.value === "0") {
      this.liveProductForm.get("price").patchValue("");
    }
  }
}
