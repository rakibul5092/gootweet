import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ModalController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { LIVE_STREAMINGS } from 'src/app/constants';
import { Video } from 'src/app/models/video';
import { AddVideoComponent } from './add-video/add-video.component';

@Component({
  selector: 'app-streamings',
  templateUrl: './streamings.page.html',
  styleUrls: ['./streamings.page.scss'],
})
export class StreamingsPage implements OnInit {
  videos: Video[] = [];
  constructor(private modalController: ModalController, private firestore: AngularFirestore) { }

  ngOnInit() {
    this.firestore.collection(LIVE_STREAMINGS, ref => ref.orderBy('timestamp', 'desc')).snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Video
        data.id = a.payload.doc.id
        return data;
      })
    })).subscribe(data => {
      this.videos = data
    })
  }
  async deleteVideo(id: string) {
    await this.firestore.collection(LIVE_STREAMINGS).doc(id).delete();
  }
  async editVideo(video: Video) {
    const props = { ...video, isEditing: true, serial: this.videos?.length || 0 }
    const modal = await this.modalController.create({
      component: AddVideoComponent,
      animated: true,
      backdropDismiss: true,
      keyboardClose: true,
      componentProps: props,
      cssClass: 'add-video',
      swipeToClose: true,
    })

    await modal.present();
  }
  async addVideo() {
    const props = { serial: this.videos?.length || 0 }
    const modal = await this.modalController.create({
      component: AddVideoComponent,
      animated: true,
      backdropDismiss: true,
      keyboardClose: true,
      componentProps: props,
      cssClass: 'add-video',
      swipeToClose: true,
    })

    await modal.present();
  }

}
