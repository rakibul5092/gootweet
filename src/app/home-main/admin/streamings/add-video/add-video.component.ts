import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ModalController } from '@ionic/angular';
import { LIVE_STREAMINGS } from 'src/app/constants';
import { getTimestamp } from 'src/app/services/functions/functions';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-add-video',
  templateUrl: './add-video.component.html',
  styleUrls: ['./add-video.component.scss'],
})
export class AddVideoComponent implements OnInit {
  @Input() id: string;
  @Input() url: string;
  @Input() title: string
  @Input() isEditing = false;
  @Input() serial: number;
  saving = false;
  constructor(private firestore: AngularFirestore, private modalController: ModalController, private util: UtilityService) { }

  ngOnInit() { }
  async addVideo() {

    this.saving = true
    if (!this.isEditing) {
      this.id = this.firestore.collection(LIVE_STREAMINGS).doc().ref.id;
    }
    await this.firestore.collection(LIVE_STREAMINGS).doc(this.id).set({
      url: this.url,
      serial: this.isEditing ? this.serial : this.serial + 1,
      title: this.title,
      timestamp: getTimestamp(),

    }, { merge: true }).then(async () => {
      this.saving = false;
      await this.modalController.dismiss();
      await this.util.showToast('Successfully added video', 'success', 'Status')

    }).catch(async err => {
      console.log(err);
      this.saving = false;
      await this.modalController.dismiss();
      await this.util.showToast('Failed to add video', '', 'Status')


    })

  }

}
