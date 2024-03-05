import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { AngularFirestoreDocument } from "@angular/fire/compat/firestore";
import { first } from "rxjs/operators";
import {
  Delivery,
  FinalSortedCartItem,
  ProductDataForCart,
  ProductForCart,
} from "src/app/models/product";
interface FinalSortedCartItemExtra extends FinalSortedCartItem {
  selectedDeliveryType: Delivery;
  deliveryTypes: Delivery[];
  shortNote: string;
  deliveryTypeDoc: AngularFirestoreDocument<unknown>;
}
@Component({
  selector: "app-order",
  templateUrl: "./order.component.html",
  styleUrls: ["./order.component.scss"],
})
export class OrderComponent implements OnInit {
  @Input() cartItem: FinalSortedCartItemExtra;
  @Output() makePaymentEvent: EventEmitter<{
    ownerUid: string;
    totalPrice: number;
    shortNote: string;
  }> = new EventEmitter();

  @Output() onDeleteEvent: EventEmitter<FinalSortedCartItemExtra> =
    new EventEmitter();
  @Output() onDeleteProduct: EventEmitter<{
    cartItem: FinalSortedCartItemExtra;
    prodIndex: number;
  }> = new EventEmitter();

  productShow = false;
  visible = false;

  constructor() {}

  ngOnInit() {
    if (this.cartItem.deliveryTypeDoc) {
      this.cartItem.deliveryTypeDoc
        .get()
        .pipe(first())
        .subscribe((deliveryQuery) => {
          let type = null;
          if (deliveryQuery.exists) {
            type = deliveryQuery.data();
          } else {
            type = {
              delivery: [
                {
                  delivery_info: {
                    delivery_time: "2-3 dienos",
                    option: "charge",
                    price: "0",
                  },
                  destination: "Lietuva",
                },
              ],
            };
          }

          this.cartItem.deliveryTypes = type.delivery;
          this.cartItem.selectedDeliveryType =
            type && type?.delivery
              ? type?.delivery[0] || null
              : this.cartItem?.products[0]?.data?.delivery_types[0] || null;
          this.visible = true;
        });
    }
  }

  makePayment(id: string, uid: string, totalPrice: number, shortNote: string) {
    this.makePaymentEvent.emit({
      ownerUid: uid,
      totalPrice: totalPrice,
      shortNote: shortNote,
    });
  }

  onSelectedOther(selected: number) {
    if (selected == 1) {
      this.cartItem.selectedDeliveryType = {
        ...this.cartItem.deliveryTypes[0],
      };
      if (this.cartItem.selectedDeliveryType?.destination == "Nida") {
        this.cartItem.selectedDeliveryType.destination = "Kuršių neriją";
      }
    } else {
      this.cartItem.selectedDeliveryType = {
        ...this.cartItem.deliveryTypes[1],
      };
      if (this.cartItem.selectedDeliveryType?.destination == "Nida") {
        this.cartItem.selectedDeliveryType.destination = "Kuršių neriją";
      }
    }
  }
  isOtherSelected() {
    let index = 0;
    index =
      this.cartItem.selectedDeliveryType?.destination == "Lietuva" ||
      "Lithuania"
        ? 0
        : 1;

    return index;
  }
  askPermissionForDelete() {
    this.onDeleteEvent.emit(this.cartItem);
  }

  onProdDelete(index: number) {
    this.onDeleteProduct.emit({ cartItem: this.cartItem, prodIndex: index });
  }
}
