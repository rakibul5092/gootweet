import { Component, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { NavController } from "@ionic/angular";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { LIVE_STREAMINGS } from "../constants";
import { Video } from "../models/video";

@Component({
  selector: "app-all-live-stream",
  templateUrl: "./all-live-stream.page.html",
  styleUrls: ["./all-live-stream.page.scss"],
})
export class AllLiveStreamPage implements OnInit {
  videos$: Observable<Video[]>
  constructor(private nav: NavController, private firestore: AngularFirestore) { }

  ngOnInit() {
    this.videos$ = this.firestore.collection(LIVE_STREAMINGS, ref => ref.orderBy('timestamp', 'desc')).get().pipe(map(actions => actions.docs.map(a =>
      ({ ...a.data() as Video, id: a.id } as Video))))
  }
  gotoSingleLiveStreams() {
    this.nav.navigateForward("single-live-stream");
  }
}
