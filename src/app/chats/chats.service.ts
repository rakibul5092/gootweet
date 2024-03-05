import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  QueryDocumentSnapshot,
} from "@angular/fire/compat/firestore";
import { NavController } from "@ionic/angular";
import { BehaviorSubject, Subscription, lastValueFrom } from "rxjs";
import { first, map, tap } from "rxjs/operators";
import {
  BASE_URL,
  chat_requests,
  connections,
  conversations,
  files_base,
  messages,
  users,
} from "../constants";
import { ChatRequestData } from "../models/chat-request";
import { ConnectionDesignerData } from "../models/connection";
import { LastMessage, Message, MessageData } from "../models/message";
import { ProductForChat } from "../models/product";
import { User } from "../models/user";
import { WallPostForChat } from "../models/wall-test";
import { AwsUploadService } from "../services/aws-upload.service";
import { getTimestamp, getUser } from "../services/functions/functions";
import { ScreenService } from "../services/screen.service";
import { UtilityService } from "../services/utility.service";
import { ToastNotificationService } from "../components/popovers/notifications/toast-notification/toast-notification.service";
import { CallService } from "../components/calls/call.service";
import { IncomingCall, OutgoingCall } from "../models/call.model";

interface ContactsExtended {
  user: User;
  sent: boolean;
}
@Injectable({
  providedIn: "root",
})
export class ChatsService {
  contacts: BehaviorSubject<User[]> = new BehaviorSubject([]);
  callData$: BehaviorSubject<IncomingCall | OutgoingCall> = new BehaviorSubject(
    null
  );
  contactsForShare: BehaviorSubject<ContactsExtended[]> = new BehaviorSubject(
    []
  );
  selectedContact: User;
  me: User;
  isSingleChat: BehaviorSubject<boolean> = new BehaviorSubject(false);
  messages: BehaviorSubject<Message[]> = new BehaviorSubject([]);
  messageListener: any;
  typingListener: any;
  wait10MinutesListener: any;
  waitWarning = false;
  userListener: any;
  chatRoom: any;
  messageText: string = "";
  isTyping: boolean = false;
  friendTyping = false;
  isUploading = false;
  userLastMessageListener: any[] = [];
  fileUploadSubscription: any;

  isLoading = true;

  selectedPost: WallPostForChat = null;
  selectedProduct: ProductForChat = null;

  myConversationDoc: AngularFirestoreDocument;
  othersConversationDoc: AngularFirestoreDocument;
  contactLoadedCalled = 0;

  constructor(
    private http: HttpClient,
    private firestore: AngularFirestore,
    public util: UtilityService,
    private awsUpload: AwsUploadService,
    public screen: ScreenService,
    public nav: NavController,
    private callService: CallService,
    private toastNotificationService: ToastNotificationService
  ) {}
  closePost() {
    this.selectedPost = null;
    this.selectedProduct = null;
  }

  async initConversationForShare() {
    const user = await getUser();
    if (user) {
      this.me = user;
      this.isLoading = true;
      this.firestore
        .collection(conversations)
        .doc(this.me.uid)
        .collection(conversations, (ref) =>
          ref.orderBy("lastMessage.timeStamp", "desc").limit(10)
        )
        .get()
        .pipe(
          first(),
          map((a) => {
            return a.docs.map((doc) => {
              let temp: ContactsExtended = {
                sent: false,
                user: doc.data() as User,
              };
              return temp;
            });
          })
        )
        .subscribe((data) => {
          this.contactsForShare.next(data as ContactsExtended[]);
          this.isLoading = false;
        });
    }
  }
  async initConversationList() {
    const user = await getUser();
    if (
      user &&
      (user.rule === "user" ||
        user.rule === "manufacturer" ||
        user.rule === "retailchain")
    ) {
      this.me = user;
      this.isLoading = true;
      this.userListener = this.firestore
        .collection(conversations)
        .doc(this.me.uid)
        .collection(conversations, (ref) =>
          ref.orderBy("lastMessage.timeStamp", "desc").limit(10)
        )
        .snapshotChanges()
        .pipe(
          map((a) => {
            return a.map((doc) => {
              return doc.payload.doc.data() as User;
            });
          })
        )
        .subscribe((data) => {
          this.contactLoadedCalled =
            data && data.length > 0 ? this.contactLoadedCalled + 1 : 0;

          this.contacts.next(data as User[]);
          this.isLoading = false;

          if (
            data &&
            data.length > 0 &&
            this.contactLoadedCalled > 2 &&
            this.me.uid !== data[0].uid &&
            this.me.uid !== data[0].lastMessage.from
          ) {
            if (
              this.selectedContact &&
              this.selectedContact.uid == data[0].uid
            ) {
              return;
            }
            const notiData = data[0];
            this.toastNotificationService.setNotification(
              {
                id: notiData.uid,
                data: {
                  type: 1,
                  seen: false,
                  timestamp: notiData.lastMessage.timeStamp,
                  senderInfo: notiData,
                  request_data: null,
                  comment_data: {
                    wall_post_id: "",
                    comment_id: "",
                    comment_text: notiData.lastMessage.body,
                    commenter_uid: "",
                    timestamp: "",
                    converted_time: "",
                  },
                  reaction_data: null,
                },
              },
              true,
              true
            );
          }
        });
    }
  }

  public openMessage(contact: any) {
    // if (this.screen.width.value < 768) {
    //   this.nav.navigateForward("chat-normal").then(() => {
    //     this.beforeInit(contact);
    //   });
    // } else {
    // }
    this.beforeInit(contact);
    setTimeout(() => {
      this.scroll();
    }, 500);
  }

  public openMessageWithCall(
    contact: User,
    callData: IncomingCall | OutgoingCall
  ) {
    this.callData$.next(callData);
    this.openMessage(contact);
  }

  beforeInit(contact) {
    this.selectedContact = contact;
    this.isSingleChat.next(true);

    this.initChat(contact);
  }
  msgs: Subscription;
  tempMsgs: BehaviorSubject<Message[]> = new BehaviorSubject([]);
  messageCollection: AngularFirestoreCollection<MessageData>;
  chatDoc: AngularFirestoreDocument;
  initChat(contact: any) {
    this.myConversationDoc = this.firestore
      .collection(conversations)
      .doc(this.me.uid)
      .collection(conversations)
      .doc(this.selectedContact.uid);
    this.othersConversationDoc = this.firestore
      .collection(conversations)
      .doc(this.selectedContact.uid)
      .collection(conversations)
      .doc(this.me.uid);
    if (this.fileUploadSubscription) {
      this.fileUploadSubscription?.unsubscribe();
      this.isUploading = false;
    }
    let chatRoom =
      "chat_" +
      (this.me.uid < contact.uid
        ? this.me.uid + "_" + contact.uid
        : contact.uid + "_" + this.me.uid);
    this.chatRoom = chatRoom;
    this.chatDoc = this.firestore.collection(messages).doc(chatRoom);
    this.tempMsgs.next([]);
    if (this.msgs) {
      this.msgs.unsubscribe();
    }
    this.msgs = this.chatDoc
      .collection<MessageData>(messages, (ref) =>
        ref.orderBy("timeStamp", "desc").limit(10)
      )
      .snapshotChanges()
      .pipe(
        map((actions) => {
          if (actions?.length > 0) {
            this.prevQuery = actions[actions.length - 1].payload
              .doc as QueryDocumentSnapshot<MessageData>;
          }
          return actions.map((a) => {
            const data: MessageData = a.payload.doc.data();
            const id = a.payload.doc.id;
            let msg: Message = {
              data: data,
              id: id,
              wallPost: null,
            };
            return msg;
          });
        }),
        tap((data) => {
          this.updateLastMessage();
          this.tempMsgs.next(data.reverse());

          if (this.shouldScroll) {
            this.scroll();
          }
        })
      )
      .subscribe();

    this.typingListener = this.chatDoc
      .collection("typing")
      .doc(this.selectedContact.uid)
      .snapshotChanges()
      .subscribe((query) => {
        let data: any = query.payload.data();
        this.friendTyping = data?.typing;
      });
  }

  updateLastMessage() {
    this.myConversationDoc
      .get()
      .pipe(first())
      .subscribe((d) => {
        if (d.exists) {
          let tempMsg = d.data().lastMessage as LastMessage;
          if (
            tempMsg &&
            !tempMsg?.isRead &&
            tempMsg.from == this.selectedContact?.uid
          ) {
            this.myConversationDoc.set(
              { lastMessage: { isRead: true, notified: true } },
              { merge: true }
            );
          }
        }
      });
  }
  prevQuery: QueryDocumentSnapshot<MessageData>;

  loadMoreMessage() {
    this.chatDoc
      .collection<MessageData>(messages, (ref) =>
        ref.orderBy("timeStamp", "desc").startAfter(this.prevQuery).limit(10)
      )
      .get()
      .pipe(
        map((a) => {
          if (a.docs.length > 0) {
            this.prevQuery = a.docs[
              a.docs.length - 1
            ] as QueryDocumentSnapshot<MessageData>;
          }
          return a.docs.map((action) => {
            const data: MessageData = action.data() as MessageData;
            const id = action.id;
            let msg: Message = {
              data: data,
              id: id,
              wallPost: null,
            };
            return msg;
          });
        })
      )
      .pipe(first())
      .subscribe((data) => {
        this.tempMsgs.next([...data.reverse(), ...this.tempMsgs.value]);
      });
  }

  async messageTextChanged(event) {
    this.messageText = event;
    if (this.messageText.trim().length == 0 && this.isTyping) {
      this.isTyping = false;
      await this.deleteTypingInfo();
    } else if (!this.isTyping) {
      this.isTyping = true;
      await this.updateTypingInfo();
    }
  }

  async updateTypingInfo() {
    await this.firestore
      .collection(messages)
      .doc(this.chatRoom)
      .collection("typing")
      .doc(this.me.uid + "")
      .set({ typing: true });
  }
  async deleteTypingInfo() {
    await this.firestore
      .collection(messages)
      .doc(this.chatRoom)
      .collection("typing")
      .doc(this.me.uid + "")
      .set({ typing: false });
  }
  sendMessageFromMobilePopup(contact: User) {
    this.selectedContact = contact;
    this.chatRoom =
      "chat_" +
      (this.me.uid < contact.uid
        ? this.me.uid + "_" + contact.uid
        : contact.uid + "_" + this.me.uid);
    // return;

    this.sendMessage(null, null, true, true);
  }
  async sendMessage(
    file: string,
    mime: string,
    isText: boolean,
    fromPopup?: boolean
  ) {
    if (isText && !this.selectedProduct) {
      if (this.messageText.trim().length == 0) {
        return;
      }
    }
    let type = 1;

    if (this.selectedProduct) {
      type = 5;
    } else if (file) {
      if (
        mime === "pdf" ||
        mime === "3gp" ||
        mime === "mov" ||
        mime === "wmv" ||
        mime === "avi" ||
        mime === "doc" ||
        mime === "docx" ||
        mime === "mp3" ||
        mime === "txt"
      ) {
        type = 4;
      } else if (
        mime === "jpg" ||
        mime === "png" ||
        mime === "jpeg" ||
        mime === "PNG" ||
        mime === "JPG" ||
        mime === "JPEG" ||
        mime === "gif"
      ) {
        type = 2;
      } else if (mime === "webm" || mime === "ogg" || mime === "mp4") {
        type = 3;
      }
    }

    let message: MessageData = {
      from: this.me.uid,
      to: this.selectedContact?.uid,
      isRead: false,
      body: isText ? this.messageText : file,
      timeStamp: getTimestamp(),
      mime: file ? mime : "",
      images: [],
      postId: this.selectedPost ? this.selectedPost.id : "",
      product: this.selectedProduct?.data ? this.selectedProduct.data : null,
      productId: this.selectedProduct ? this.selectedProduct.id : "",
      productOwnerUid: this.selectedProduct?.data
        ? this.selectedProduct?.owner?.uid
        : "",
      type: type,
    };

    await this.firestore
      .collection(messages)
      .doc(this.chatRoom)
      .collection(messages)
      .add(message);

    await this.deleteTypingInfo();
    let lastMessage: LastMessage = message as LastMessage;
    lastMessage.notified = false;

    this.myConversationDoc.set({ lastMessage: lastMessage }, { merge: true });
    this.othersConversationDoc.set(
      { lastMessage: lastMessage },
      { merge: true }
    );
    this.messageText = "";
    if (!fromPopup) {
      this.selectedPost = null;
      this.selectedProduct = null;
    }
    this.scroll();
  }

  firstTime = false;
  initScrollView(element: any) {
    if (element) {
      this.scrollView = element;
    }
  }

  scrollView: any;
  scroll() {
    if (this.scrollView) {
      setTimeout(() => {
        this.scrollView.nativeElement.scrollTop =
          this.scrollView.nativeElement.scrollHeight;
      }, 500);
    }
  }
  shouldScroll = false;
  onScroll(event) {
    let scrollTop = event.target.scrollTop;
    let scrollHeight = event.target.scrollHeight;
    let offsetHeight = event.target.offsetHeight;
    if (scrollTop >= scrollHeight - offsetHeight - 100) {
      this.shouldScroll = true;
    } else {
      this.shouldScroll = false;
    }
  }
  backFromChat() {
    this.isSingleChat.next(false);
    if (this.messageListener) {
      this.messageListener.unsubscribe();
    }
    if (this.fileUploadSubscription) {
      this.fileUploadSubscription.unsubscribe();
      this.isUploading = false;
    }
    if (this.msgs) {
      this.msgs.unsubscribe();
    }
  }

  closeMessage() {
    this.isSingleChat.next(false);
    this.selectedContact = null;
    if (this.messageListener) {
      this.messageListener?.unsubscribe();
    }
    if (this.wait10MinutesListener) {
      this.wait10MinutesListener.unsubscribe();
    }
    if (this.fileUploadSubscription) {
      this.fileUploadSubscription?.unsubscribe();
      this.isUploading = false;
    }
    this.toastNotificationService.setNotification(null);
    this.scrollView = null;
    if (this.msgs) {
      this.msgs.unsubscribe();
    }
  }

  ngOnDestroy() {
    this.userLastMessageListener.forEach((listener) => {
      listener?.unsubscribe();
    });
    this.contactLoadedCalled = 0;
    this.contacts.next([]);
    this.userListener?.unsubscribe();
    if (this.typingListener) {
      this.typingListener.unsubscribe();
    }
    if (this.messageListener) {
      this.messageListener.unsubscribe();
    }
    // if (this.msgs) {
    //   this.msgs.unsubscribe();
    // }
  }

  // image or file sending section
  image: {
    base64String: string;
    format: string;
  };
  makeName(mimeType: string, uid: any): string {
    const timestamp = Number(new Date());
    const name = uid + "_" + timestamp + "." + mimeType;
    return name;
  }
  onBrowseImage(event: any) {
    let files: any[] = event.target.files;
    for (let i = 0; i < files.length; i++) {
      let imageFile = event.target.files[i];
      const name = imageFile.name;
      const format = name.substr(name.lastIndexOf(".") + 1);
      // this.image = {
      //   base64String: imageFile,
      //   format: format,
      // };
      // this.uploadFile(this.makeName(this.image.format, this.me.uid));

      let reader = new FileReader();
      reader.onload = async (e: any) => {
        let imageData = e.target.result;

        this.image = {
          base64String: imageData,
          format: format,
        };

        await this.uploadFile(this.makeName(this.image.format, this.me.uid));
      };
      reader.readAsDataURL(imageFile);
    }
  }
  async uploadFile(name: string) {
    this.isUploading = true;

    await this.awsUpload
      .uploadImage("files", name, this.image.base64String)
      // .on("httpUploadProgress", (evt) => {
      // })
      // .send((err, data) => {
      .then((res: any) => {
        const imgUrl = files_base + name;
        this.sendMessage(imgUrl, this.image.format, false);
        setTimeout(() => {
          this.isUploading = false;
        }, 500);
      })
      .catch((err) => console.log(err));

    // const end = "upload_file.php";
    // this.isUploading = true;
    // const postData = new FormData();
    // postData.append("file", this.image.base64String);
    // postData.append("file_name", this.makeName(this.image.format, this.me.uid));
    // this.fileUploadSubscription = this.http
    //   .post(BASE_URL + end, postData)
    //   .subscribe((res: any) => {
    //     if (res.status) {
    //       this.sendMessage(res.file_url, this.image.format, false);
    //       setTimeout(() => {
    //         this.isUploading = false;
    //       }, 500);
    //     }
    //   });
  }

  calculateTime(time: any) {
    return time ? time.toDate() : "";
  }

  upload(postData: any) {
    const end = "upload_file.php";
    return this.http.post(BASE_URL + end, postData);
  }

  blockAndRequestAgain() {
    this.firestore
      .collection(chat_requests)
      .doc(this.selectedContact?.uid)
      .collection(chat_requests)
      .doc(this.me.uid)
      .get()
      .pipe(first())
      .subscribe(async (reqQuery) => {
        let data: ChatRequestData = reqQuery.data() as ChatRequestData;

        if (data) {
          let chatRequest: ChatRequestData = {
            budget: data?.budget,
            designerUid: "",
            images: data?.images,
            interestedInOtherGood: data?.interestedInOtherGood,
            isAccepted: false,
            isBlocked: true,
            isFirstTime: false,
            manufacturer: data?.manufacturer,
            prev_designer_uid: this.selectedContact?.uid,
            productId: data?.productId,
            text: data?.text,
            user: data?.user,
            timestamp: data?.timestamp,
            commission: "",
          };
          await this.firestore
            .collection("temp_chat_request")
            .doc(this.me.uid)
            .collection("temp_chat_request")
            .add(chatRequest);

          this.closeMessage();
        }
      });
  }
  openUrl(url: string, data) {
    window.open(url, "_blank");
  }
  async sendRequest(
    userUid: string,
    designerUid: string,
    request: ChatRequestData
  ) {
    await this.firestore
      .collection(chat_requests)
      .doc(designerUid)
      .collection(chat_requests)
      .doc(userUid)
      .set(request);
  }
  async getAllConnectedDesigner(
    manufacturerUid: string
  ): Promise<ConnectionDesignerData[]> {
    return await lastValueFrom(
      this.firestore
        .collection(users)
        .doc(manufacturerUid)
        .collection(connections)
        .get()
    ).then((query) => {
      let connectedDesigner: ConnectionDesignerData[] = [];
      query.forEach((item) => {
        let data = item.data() as ConnectionDesignerData;
        connectedDesigner.push(data);
      });
      return connectedDesigner;
    });
  }
}
