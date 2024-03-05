// import { Injectable } from '@angular/core';
// import { CartListPopupService } from '../components/popovers/cart-list-popup/cart-list-popup.service';
// import { NormalGood, Product, ProductForCart } from '../models/product';
// import { User } from '../models/user';
// import { getTimestamp } from './functions/functions';
// import { LoginService } from './login.service';
// import { UtilityService } from './utility.service';

// @Injectable({
//   providedIn: 'root',
// })
// export class AddToCartService {
//   me:User;
//   constructor(private loginService: LoginService, private utils: UtilityService) {
//     loginService.getUser().then(user => {
//       this.me = user
//     })
//   }

//   addToCart(product: Product, ownerId: string) {
//     if (this.productQty >= 0) {
//       let prod: ProductForCart = { ...product } as ProductForCart;
//       prod.cart_time = getTimestamp();
//       prod.totalUnitOfMeasurment =
//         Number(Number(this.totalUnitOfMeasurement).toFixed(2)) || 0;
//       prod.ownerId = ownerId;
//       prod.seen = false;
//       prod.cart_price = +this.mainProductSelectedMat.price;
//       if (this.isDesigner) {
//         prod.isDesigner = true;
//         prod.designerId = this.me.uid;
//       } else {
//         prod.isDesigner = false;
//       }
//       if (Array.isArray(product.good)) {
//         prod.good = this.mainProductSelectedMat;
//       } else {
//         if (this.selectedColor != '') {
//           (prod.good as NormalGood).colors = [this.selectedColor];
//         }
//       }
//       prod.quantity = this.productQty; //need to confirm about quantity when click the same product multiple times...

//       if (this.me) {
//         if (this.isDesigner) {
//           if (this.screen.width.value > 767) {
//             if (this.designerChat.selectedContact) {
//               this.productPopupService
//                 .addToCart(prod, this.designerChat?.selectedContact?.uid)
//                 .then(() => {
//                   this.utils.showToast('Prekė įdėta į krepšelį', 'success');
//                 })
//                 .catch((err) => {
//                   console.log('add to cart error: ', err);
//                   this.utils.showToast('Bandykite dar kartą...', 'danger');
//                 });
//             } else {
//               this.utils.showToast('Pasirinkite kontaktą.', 'danger');
//             }
//           } else {
//             this.sendToMessenger(this.wallPost, prod);
//           }
//         } else {
//           this.productPopupService
//             .addToCart(prod, this.me.uid)
//             .then(() => {
//               this.utils.showToast('Prekė įdėta į krepšelį!', 'success');
//             })
//             .catch((err) => {
//               console.log('add to cart error: ', err);
//               this.utils.showToast('Bandykite dar kartą...', 'danger');
//             });
//         }
//       } else {
//         this.productPopupService
//           .addToLocalCart(prod)
//           .then(() => {
//             const cartPopupService =
//               this.injector.get<CartListPopupService>(CartListPopupService);
//             cartPopupService.getLocalCartItems();
//             this.utils.showToast('Prekė įdėta į krepšelį!', 'success');
//           })
//           .catch((err) => {
//             console.log('add to cart error: ', err);
//             this.utils.showToast('Bandykite dar kartą...', 'danger');
//           });
//       }
//     } else {
//       this.qtyErrMsg = 'Pasirinkite kiekį';
//     }
//   }
// }
