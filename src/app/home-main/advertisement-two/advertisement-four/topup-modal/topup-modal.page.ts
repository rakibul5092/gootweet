import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-topup-modal',
  templateUrl: './topup-modal.page.html',
  styleUrls: ['./topup-modal.page.scss'],
})
export class TopupModalPage implements OnInit {
  amount: number;

  constructor(private modal: ModalController) { }

  ngOnInit() {
  }

  save() {
    if (this.amount) {
      this.modal.dismiss(this.amount);
    }
  }

}
