import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { IonInput, NavController } from "@ionic/angular";
import { Subject, map, takeUntil } from "rxjs";
import { LIVE_STREAMINGS_PRODUCT_PHOTO_BASE } from "src/app/constants";
import { AddProductService } from "src/app/home-main/manufacturer/products/product-information/add-product.service";
import { LiveChatPage } from "src/app/mobile/live-chat/live-chat.page";
import { LiveProduct } from "src/app/models/product";
import { User } from "src/app/models/user";
import { AwsUploadService } from "src/app/services/aws-upload.service";
import { getTimestamp } from "src/app/services/functions/functions";
import { LiveStreamingService } from "src/app/services/live-streaming.service";
import { LoginService } from "src/app/services/login.service";
import { ScreenService } from "src/app/services/screen.service";
import { UtilityService } from "src/app/services/utility.service";

@Component({
  selector: "app-create-live",
  templateUrl: "./create-live.page.html",
  styleUrls: ["./create-live.page.scss"],
})
export class CreateLivePage implements OnInit, OnDestroy {
  public previousComponent = LiveChatPage;
  public liveId = "";
  public liveType = "";
  public title = "";
  private destroy$ = new Subject();
  public liveProductForm: FormGroup;
  public imageData: any = null;
  public image: any;
  public isImageSelected = false;
  public sizes: { id: string; name: string; selected: boolean }[] = [];
  public colors: { id: string; name: string; selected: boolean }[] = [];
  public products: LiveProduct[] = [];
  public liveProductPhotoBaseUrl = LIVE_STREAMINGS_PRODUCT_PHOTO_BASE;
  public me: User;
  public isEditing = false;
  public selectedProduct: LiveProduct = null;
  private productsModal: any;
  public colorModel: string;
  public sizeModel: string;

  constructor(
    private screen: ScreenService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private loginService: LoginService,
    private streamService: LiveStreamingService,
    private nav: NavController,
    private addProductService: AddProductService,
    private uploaderService: AwsUploadService,
    private utils: UtilityService
  ) {}
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$?.unsubscribe();
  }

  ionViewWillEnter = () => this.screen.fullScreen.next(true);
  ionViewWillLeave = () => {
    this.imageData = null;
    this.image = null;
    this.liveProductForm.reset();
    this.screen.fullScreen.next(false);
  };
  async ngOnInit() {
    this.liveProductForm = this.buildForm();
    this.me = await this.loginService.getUser();
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((res) => {
      if (res.id) {
        this.liveId = res.id;
        this.liveType = res.type;
        this.liveProductForm.get("liveId").patchValue(this.liveId);
        this.liveProductForm.get("ownerUid").patchValue(this.me?.uid || "");
      }
    });
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
  }

  public onTitleChange(event) {
    this.title = event.target.value;
  }

  private buildForm() {
    return this.fb.group({
      id: ["", Validators.required],
      liveId: ["", Validators.required],
      ownerUid: ["", Validators.required],
      title: [""],
      photo: [null, Validators.required],
      price: [null],
      colors: [[]],
      sizes: [[]],
      about: [""],
    });
  }

  public onBrowseImage(event) {
    let files = event.target.files;
    const imageFile = files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      let imageData = e.target.result;

      const imageName = Date.now().toString() + "_" + imageFile.name;
      let image = {
        imageForView: imageData,
        base64String: imageData,
        name: imageName,
      };
      this.imageData = image;
      this.image = imageName;
      this.liveProductForm.get("photo").patchValue(this.image);
    };
    reader.readAsDataURL(imageFile);

    (<HTMLInputElement>document.getElementById("browseAlbum")).value = "";
  }

  private imageDatas = [];
  private images = [];
  public async onBrowseMultipleImages(event) {
    const files = event.target.files;
    await this.utils.present("Uploading...");
    const limit = files.length > 20 ? 20 : files.length;
    for (let i = 0; i < limit; i++) {
      const imageFile = files[i];
      const reader = new FileReader();
      reader.onload = async (e: any) => {
        let imageData = e.target.result;
        const imageName = Date.now().toString() + "_" + imageFile.name;
        let image = {
          imageForView: imageData,
          base64String: imageData,
          name: imageName,
        };
        this.imageDatas.push(image);
        this.images.push(imageName);
        await this.uploaderService
          .uploadImage("live_products", imageName, image.base64String)
          .then(async () => {
            const liveProduct: LiveProduct = {
              id: this.streamService.getFirebaseDocId(),
              ownerUid: this.me.uid,
              liveId: this.liveId,
              title: "",
              photo: imageName,
              price: "0",
              colors: [],
              sizes: [],
              about: "",
              timestamp: getTimestamp(),
            };
            await this.streamService.saveLiveProduct(
              liveProduct,
              this.me,
              false
            );
            if (i === limit - 1) {
              (<HTMLInputElement>(
                document.getElementById("browseAlbums")
              )).value = "";
              await this.utils.dismiss();
            }
          })
          .catch((e) => {
            this.utils.dismiss();
          });
      };

      reader.readAsDataURL(files[i]);
    }
  }

  public onCatalogEditing(product: LiveProduct) {
    this.selectedProduct = product;
    this.reset();
    const tempProd = { ...product };
    this.liveProductForm.patchValue(tempProd);
    this.isImageSelected = true;
    this.isEditing = true;
  }

  private reset() {
    this.liveProductForm.reset({
      price: null,
      liveId: this.liveId,
      ownerUid: this.me.uid,
    });
  }

  public async onCatalogDelete(product: LiveProduct) {
    const permission = await this.utils.askDeletePermission();
    const res = await permission.onDidDismiss();
    if (res?.data?.confirm) {
      this.streamService.deleteCatalogById(product.id);
      this.uploaderService.removeImages("live_products", [product.photo]);
    }
  }

  public onEditingCancel(modal) {
    modal.dismiss();
    this.isImageSelected = false;
    if (this.isEditing) {
      this.image = null;
      this.imageData = null;
      this.isEditing = false;
    }
  }

  public onContinue(continueToLive: boolean) {
    if (this.liveProductForm.valid) {
      this.reset();
      if (continueToLive) {
        if (this.productsModal) this.productsModal?.dismiss();
        this.nav.back();
      }
      this.isEditing = false;
    } else {
      this.isImageSelected = true;
    }
  }

  public async continueToLive(modal) {
    if (this.liveProductForm.valid) {
      this.streamService.products.unshift(this.liveProductForm.getRawValue());
      this.onProductInfoDone(modal, true);
      await this.productsModal.dismiss();
    }
  }

  public onRemoveImage() {
    this.imageData = null;
    this.image = null;
  }

  async onProductInfoDone(modal, continueToLive = false) {
    if (!continueToLive) {
      continueToLive = !this.isEditing;
    }
    if (!this.isEditing) {
      this.liveProductForm
        .get("id")
        .patchValue(this.streamService.getFirebaseDocId());
    }
    if (this.liveProductForm.valid) {
      await this.utils.present("Išsaugomas...");
      if (this.isEditing) {
        await this.saveFinalData(modal, continueToLive);
      } else {
        await this.uploaderService
          .uploadImage("live_products", this.image, this.imageData.base64String)
          .then(async () => {
            this.saveFinalData(modal, continueToLive);
          })
          .catch(async (e) => {
            await this.utils.dismiss();
            await this.utils.showAlert("Klaida", e);
          });
      }
    } else {
      this.utils.showAlert("Reikalingas", "Prašome nustatyti kainą");
    }
  }

  async saveFinalData(modal, continueToLive: boolean) {
    await this.streamService
      .saveLiveProduct(
        {
          ...this.liveProductForm.getRawValue(),
          liveId: this.liveId,
          title: this.title,
          timestamp: getTimestamp(),
        },
        this.me,
        continueToLive
      )
      .then(async () => {
        this.streamService.products.unshift(this.liveProductForm.getRawValue());
        await modal?.dismiss();
        this.onContinue(continueToLive);
      })
      .catch(async (e) => {
        await this.utils.showAlert("Klaida", e);
      });
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

  public onCancel(modal, type: number) {
    if (type === 1) {
      this.reset();
      modal.dismiss();
    } else {
      this.onEditingCancel(modal);
    }
  }

  public onProductModalOpen(modal) {
    this.productsModal = modal;
    this.streamService
      .getAllProductByUid(this.me.uid)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.products = data;
      });
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

  public onPriceFocus(event) {
    if (event.target.value === 0 || event.target.value === "0") {
      this.liveProductForm.get("price").patchValue("");
    }
  }

  public onDeleteColorOrSize(item: any, isColor: boolean) {
    this.addProductService.deleteColorOrSize(item, isColor, this.me.uid);
  }

  longPressTimeout: any;
  public startLongPress() {
    this.longPressTimeout = setTimeout(() => {
      // Add your custom long-press functionality here
    }, 500); // Adjust the duration as per your requirement
  }

  public endLongPress() {
    clearTimeout(this.longPressTimeout);
  }
}
