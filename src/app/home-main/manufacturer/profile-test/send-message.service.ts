import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { ChatService } from "src/app/chat/chat-designer/chat.service";
import { ChatsService } from "src/app/chats/chats.service";
import { conversations } from "src/app/constants";
import { getTimestamp } from "src/app/services/functions/functions";

@Injectable({
  providedIn: "root",
})
export class SendMessageService {
  constructor(
    private firestore: AngularFirestore,
    private chatsService: ChatsService,
    private chatService: ChatService
  ) { }

  sendMessage(me: any, profileOwner: any) {
    if (me.rule == "designer") {
      this.initLogic(this.chatService, me, profileOwner)
    } else {
      this.initLogic(this.chatsService, me, profileOwner);
    }
  }

  initLogic(service: any, me: any, profileOwner: any) {
    service.selectedContact = profileOwner;
    me.lastMessage = { timeStamp: getTimestamp() };
    service.me = me;
    service.openMessage(profileOwner);
    profileOwner.lastMessage = { timeStamp: getTimestamp() };
    let newUser: any = me;
    newUser.isNew = true;
    this.updateFirebase(newUser, profileOwner)
  }

  async updateFirebase(fromUser: any, toUser: any,) {
    let batch = this.firestore.firestore.batch();
    batch.set(this.firestore.collection(conversations).doc(fromUser.uid).collection(conversations).doc(toUser.uid).ref, toUser, { merge: true })
    batch.set(this.firestore.collection(conversations).doc(toUser.uid).collection(conversations).doc(fromUser.uid).ref, fromUser, { merge: true })
    await batch.commit();
  }
}
