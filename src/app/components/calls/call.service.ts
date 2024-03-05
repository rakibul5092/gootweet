import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
// import { NgxImageCompressService } from "ngx-image-compress";
import {
  BehaviorSubject,
  Observable,
  interval,
  lastValueFrom,
  map,
} from "rxjs";
import { CALL_HISTORY, IN_CALLS } from "src/app/constants";
import { IncomingCall, OutgoingCall } from "src/app/models/call.model";
import { User } from "src/app/models/user";
import { getTimestamp } from "src/app/services/functions/functions";

@Injectable({
  providedIn: "root",
})
export class CallService {
  public outgoingCall: BehaviorSubject<OutgoingCall> = new BehaviorSubject(
    null
  );
  public incomingCall: BehaviorSubject<IncomingCall> = new BehaviorSubject(
    null
  );
  private startTime: number;
  private elapsedTimeSubject = new BehaviorSubject<string>("00:00");
  constructor(private firestore: AngularFirestore) {}

  public async makeCall(receiverInfo: User, callerInfo: User) {
    const id = this.firestore.createId();
    this.outgoingCall.next({
      receiverInfo: receiverInfo,
      id: id,
      callerInfo: callerInfo,
    });
    const callData = {
      callerInfo: callerInfo,
      id: id,
      receiverInfo: receiverInfo,
      inCall: true,
      accepted: false,
      timestamp: getTimestamp(),
    };
    let batch = this.firestore.firestore.batch();
    batch.set(
      this.firestore.collection(IN_CALLS).doc(receiverInfo.uid).ref,
      callData
    );
    batch.set(this.firestore.collection(CALL_HISTORY).doc(id).ref, callData);
    await batch.commit();
  }

  public async acceptCall(data: IncomingCall) {
    const callData = { ...data, accepted: true };
    let batch = this.firestore.firestore.batch();
    batch.set(
      this.firestore.collection(IN_CALLS).doc(callData.receiverInfo.uid).ref,
      callData
    );
    batch.set(
      this.firestore.collection(CALL_HISTORY).doc(callData.id).ref,
      callData
    );
    await batch.commit();
  }

  public async rejectCall(data: IncomingCall, isMissedCall = false) {
    this.outgoingCall.next(null);
    this.incomingCall.next(null);
    const callData = null;
    let batch = this.firestore.firestore.batch();
    if (isMissedCall) {
      batch.set(
        this.firestore.collection(CALL_HISTORY).doc(data.id).ref,
        { isMissedCall: true },
        { merge: true }
      );
    }
    batch.delete(
      this.firestore.collection(IN_CALLS).doc(data.receiverInfo.uid).ref
    );
    await batch.commit();
  }

  public async getCallInfo(id: string) {
    return await lastValueFrom(
      this.firestore
        .collection(CALL_HISTORY)
        .doc(id)
        .get()
        .pipe(
          map((a) => {
            const data: IncomingCall = (
              a.exists ? a.data() : null
            ) as IncomingCall;
            return data;
          })
        )
    );
  }

  public subscribeToIncomingCall(me: User) {
    return this.initCallListener(me.uid);
  }

  public isReceivedCall(receiverUid: string) {
    return this.initCallListener(receiverUid);
  }

  public startTimer(): BehaviorSubject<string> {
    this.startTime = Date.now();
    interval(1000).subscribe(() => {
      this.elapsedTimeSubject.next(this.updateFormattedTime());
    });
    return this.elapsedTimeSubject;
  }
  private updateFormattedTime() {
    const elapsedSeconds = this.getElapsedTime();
    const hours = Math.floor(elapsedSeconds / 3600);
    const minutes = Math.floor((elapsedSeconds % 3600) / 60);
    const seconds = elapsedSeconds % 60;

    return `${this.padZero(hours)}:${this.padZero(minutes)}:${this.padZero(
      seconds
    )}`;
  }
  private padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }
  private getElapsedTime(): number {
    return Math.floor((Date.now() - this.startTime) / 1000);
  }
  private initCallListener(uid: string) {
    return this.firestore
      .collection(IN_CALLS)
      .doc(uid)
      .snapshotChanges()
      .pipe(
        map((a) => {
          const data: IncomingCall = (
            a.payload.exists ? a.payload.data() : null
          ) as IncomingCall;
          return data;
        })
      );
  }
}
