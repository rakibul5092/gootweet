import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CartItemComponent } from './cart-item/cart-item.component';
import { HomeItemComponent } from './home-item/home-item.component';
import { NotifcationItemComponent } from './notifcation-item/notifcation-item.component';



@NgModule({
  declarations: [CartItemComponent, HomeItemComponent, NotifcationItemComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [HomeItemComponent, NotifcationItemComponent, CartItemComponent]
})
export class MenuModule { }
