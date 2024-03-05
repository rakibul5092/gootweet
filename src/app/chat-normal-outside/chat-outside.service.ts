import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {
  BASE_URL,
  users,
  messages,
  conversations,
  connections,
  chat_requests,
  commissions,
  products,
  files_base,
} from "../constants";
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  QueryDocumentSnapshot,
} from "@angular/fire/compat/firestore";
import { BehaviorSubject, Subscription, lastValueFrom } from "rxjs";
import { User } from "../models/user";
import { LastMessage, Message, MessageData } from "../models/message";
import { NavController } from "@ionic/angular";
import { LoginService } from "../services/login.service";
import { UtilityService } from "../services/utility.service";
import { WallPostForChat } from "../models/wall-test";
import { Product, ProductForChat } from "../models/product";
import { ConnectionDesignerData } from "../models/connection";
import { ChatRequestData } from "../models/chat-request";
import { AwsUploadService } from "../services/aws-upload.service";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { getTimestamp } from "../services/functions/functions";
import { HttpRequestsService } from "../services/http-requests.service";
import { inTime } from "../services/functions/pipe-functions";
@Injectable({
  providedIn: "root",
})
export class ChatOutsideService {
  // contacts: BehaviorSubject<User[]> = new BehaviorSubject([]);
  selectedContact: User;
  me: User;
  isSingleChat = false;
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

  selectedPost: WallPostForChat = null;
  selectedProduct: ProductForChat = null;
  mainProduct: Product = null;
  productOwnerUid: string;

  myConversationDoc: AngularFirestoreDocument;
  othersConversationDoc: AngularFirestoreDocument;

  chatRequest: ChatRequestData = {
    budget: 0,
    designerUid: "",
    images: [],
    interestedInOtherGood: false,
    isFirstTime: false,
    manufacturer: null,
    productId: "",
    user: null,
    text: "",
    isBlocked: false,
    prev_designer_uid: "",
    isAccepted: false,
    timestamp: "",
    commission: "",
  };
  constructor(
    private http: HttpClient,
    public storage: LoginService,
    public firestore: AngularFirestore,
    public util: UtilityService,
    private awsUpload: AwsUploadService,
    private httpService: HttpRequestsService,
    private nav: NavController
  ) {}
  closePost() {
    this.selectedPost = null;
    this.selectedProduct = null;
  }
  sendDesignerRequest(text: string) {
    this.isSingleChat = false;
    let userId = Date.now();
    let user: User = {
      cover_photo: "",
      email: "",
      full_name: { first_name: "User", last_name: userId + "" },
      uid: "user" + userId,
      rule: "user",
      address: "",
      category: "",
      details: "",
      emailVerified: false,
      fb_id: "",
      google_id: "",
      is_first_time: true,
      lastMessage: null,
      phone: "",
      profile_photo: "",
      unread_message: 0,
      status: "",
    };
    this.storage.saveOutsideUser(user).then(() => {});
    this.chatRequest.user = user;
    this.chatRequest.budget = 0;
    this.getAverageCommission(this.chatRequest.manufacturer?.uid).then(
      (avg) => {
        this.chatRequest.commission = avg + "";
        this.chatRequest.designerUid = "";
        this.chatRequest.text = text;
        this.chatRequest.timestamp = getTimestamp();
        this.httpService
          .insertDesignerRequest(this.chatRequest, inTime())
          .subscribe((res: any) => {
            if (res.status) {
              this.messageText = "";

              this.initConversationList(false);
            }
          });
      }
    );
  }

  initConversationList(isOldConversation: boolean = false) {
    this.storage
      .getOutSideUser()
      .then((user: User) => {
        this.me = user;
        this.userListener = this.firestore
          .collection(conversations)
          .doc(this.me.uid)
          .collection(conversations, (ref) => ref.where("isNew", "==", true))
          .snapshotChanges()
          .subscribe((query) => {
            query.forEach((item) => {
              let contact: any = item.payload.doc.data();

              if (this.me.uid != contact.uid && contact.isNew) {
                contact.lastMessage = null;
                this.openMessage(contact, isOldConversation);
              }
            });
          });
      })
      .catch(() => {
        this.nav.back();
      });
  }

  isOpened = false;
  openMessage(contact: any, isOldConversation: boolean = false) {
    this.chatRequest.text = "";
    this.isOpened = true;
    this.selectedContact = contact;
    this.isSingleChat = true;

    this.initChat(contact, isOldConversation);
    setTimeout(() => {
      this.scroll();
    }, 500);
  }
  msgs: Subscription;
  tempMsgs: Message[] = [];
  messageCollection: AngularFirestoreCollection<MessageData>;
  chatDoc: AngularFirestoreDocument;
  initChat(contact: any, isOldConversation: boolean = false) {
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
    if (this.messageListener) {
      this.messageListener?.unsubscribe();
    }
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
    if (isOldConversation && this.mainProduct) {
      this.sendProductToOldConversation(this.mainProduct);
    }
    this.chatDoc = this.firestore.collection(messages).doc(chatRoom);
    this.tempMsgs = [];
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
          if (this.shouldScroll) {
            this.scroll();
          }
          for (let msg of data.reverse()) {
            if (
              !this.tempMsgs.find((item) => {
                return item.id == msg.id;
              })
            ) {
              this.tempMsgs.push(msg);
            }
          }
        })
      )
      .subscribe();

    this.typingListener = this.chatDoc
      .collection("typing")
      .doc(this.selectedContact?.uid)
      .snapshotChanges()
      .subscribe((query) => {
        let data: any = query.payload.data();
        this.friendTyping = data?.typing;
      });
  }
  updateLastMessage() {
    this.myConversationDoc.get().subscribe((d) => {
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
      .subscribe((data) => {
        data.forEach((d) => {
          this.tempMsgs.unshift(d);
        });
      });
  }

  updateWaitTimer() {
    // this.firestore
    //   .collection(messages)
    //   .doc(this.chatRoom)
    //   .set({ warning: { show: false } }, { merge: true });
  }

  async messageTextChanged() {
    if (this.messageText.trim().length == 0) {
      this.isTyping = false;
      if (this.selectedContact) {
        await this.deleteTypingInfo();
      }
    } else {
      this.isTyping = true;
      if (this.selectedContact) {
        await this.updateTypingInfo();
      }
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
  openUrl(url: string, data) {
    window.open(url, "_blank");
  }

  sendProductToOldConversation(product: Product) {
    this.firestore
      .collection(messages)
      .doc(this.chatRoom)
      .collection(messages, (ref) => ref.orderBy("timeStamp", "desc").limit(1))
      .get()
      .subscribe((query) => {
        query.forEach(async (item) => {
          if (item.data().productId !== product.id) {
            let message: MessageData = {
              from: this.me.uid,
              to: this.selectedContact?.uid,
              isRead: false,
              body: "",
              timeStamp: getTimestamp(),
              mime: "",
              images: [],
              postId: product ? product.id : "",
              product: product ? product : null,
              productId: product ? product.id : "",
              productOwnerUid: this.productOwnerUid,
              type: 5,
            };

            let lastMessage = message as LastMessage;
            lastMessage.notified = false;
            await this.firestore
              .collection(messages)
              .doc(this.chatRoom)
              .collection(messages)
              .add(message);
            await this.deleteTypingInfo();
            await this.firestore
              .collection(messages)
              .doc(this.chatRoom)
              .set({ lastMessage: lastMessage, warning: { show: false } });
            this.messageText = "";
            this.selectedPost = null;
            this.mainProduct = null;
            this.selectedProduct = null;
            this.scroll();
          }
        });
      });
  }

  async sendMessage(file: string, mime: string, isText: boolean) {
    if (isText && !this.selectedProduct) {
      if (this.messageText.trim().length == 0) {
        return;
      }
    }
    let type = 1;
    // if (this.selectedPost) {
    //   type = 6;
    // } else

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
      productOwnerUid: this.selectedProduct
        ? this.selectedProduct?.owner?.uid
        : "",
      type: type,
    };
    let lastMessage = message as LastMessage;
    lastMessage.notified = false;
    await this.firestore
      .collection(messages)
      .doc(this.chatRoom)
      .collection(messages)
      .add(message);
    await this.deleteTypingInfo();
    this.myConversationDoc.set({ lastMessage: lastMessage }, { merge: true });
    this.othersConversationDoc.set(
      { lastMessage: lastMessage },
      { merge: true }
    );
    // this.unreadCountUpdate(1, this.selectedContact.uid);
    this.messageText = "";
    this.selectedPost = null;
    this.selectedProduct = null;
    // this.updateWaitTimer();
    this.scroll();
  }
  initScrollView(element: any) {
    if (element) {
      this.scrollView = element;
    }
  }

  scrollView: any;
  scroll() {
    setTimeout(() => {
      if (this.scrollView) {
        this.scrollView.nativeElement.scrollTop =
          this.scrollView.nativeElement.scrollHeight;
      }
    }, 500);
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
  // unreadCountUpdate(c: number, uid) {
  //   this.firestore
  //     .collection(users)
  //     .doc(uid)
  //     .get()
  //     .subscribe((query) => {
  //       let count = query.data().unread_message;

  //       if (count + c < 0) {
  //         count = 0;
  //       } else {
  //         count += c;
  //       }
  //       this.firestore
  //         .collection(users)
  //         .doc(uid)
  //         .update({ unread_message: count });
  //     });
  // }

  backFromChat() {
    this.selectedContact = null;
    if (this.userListener) {
      this.userListener.unsubscribe();
    }
    if (this.messageListener) {
      this.messageListener.unsubscribe();
    }
    if (this.wait10MinutesListener) {
      this.wait10MinutesListener.unsubscribe();
    }
    if (this.fileUploadSubscription) {
      this.fileUploadSubscription.unsubscribe();
      this.isUploading = false;
    }
    if (this.msgs) {
      this.msgs.unsubscribe();
    }
  }

  ngOnDestroy() {
    if (this.userListener) {
      this.userListener?.unsubscribe();
    }

    this.userLastMessageListener.forEach((listener) => {
      listener?.unsubscribe();
    });
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

      let reader = new FileReader();
      reader.onload = (e: any) => {
        let imageData = e.target.result;
        this.image = {
          base64String: imageData,
          format: format,
        };

        this.uploadFile(this.makeName(this.image.format, this.me.uid));
      };
      reader.readAsDataURL(imageFile);
    }
  }
  uploadFile(name: string) {
    this.isUploading = true;

    this.awsUpload
      .uploadImage("files", name, this.image.base64String)
      // .on("httpUploadProgress", (evt) => {
      //   console.log(evt.loaded + " of " + evt.total + " Bytes");
      // })
      // .send((err, data) => {
      .then((res: any) => {
        const imgUrl = files_base + name;
        this.sendMessage(imgUrl, this.image.format, false);
        setTimeout(() => {
          this.isUploading = false;
        }, 500);
      })
      .catch((err) => {
        console.log(err);
      });

    // const end = "upload_file.php";
    // this.isUploading = true;
    // const postData = new FormData();
    // postData.append("file", this.image.base64String);
    // postData.append("file_name", this.makeName(this.image.format, this.me.uid));
    // this.fileUploadSubscription = this.http
    //   .post(BASE_URL + end, postData)
    //   .subscribe((res: any) => {
    //     // console.log(res);
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
      .collection(conversations)
      .doc(this.me.uid)
      .collection(conversations)
      .doc(this.selectedContact?.uid)
      .update({ isNew: false })
      .then(() => {
        this.selectedContact = null;
        this.tempMsgs = [];
        this.backFromChat();
      });
  }
  async getAverageCommission(manufacturerUid: string): Promise<number> {
    return await lastValueFrom(
      this.firestore.collection(commissions).doc(manufacturerUid).get()
    ).then((query: any) => {
      return query?.data()?.averageCommission
        ? query.data().averageCommission
        : 5;
    });
  }

  // blockAndRequestAgain() {
  //   this.firestore
  //     .collection(chat_requests)
  //     .doc(this.selectedContact.uid)
  //     .collection(chat_requests)
  //     .doc(this.me.uid)
  //     .get()
  //     .subscribe((reqQuery) => {
  //       let data: ChatRequestData = reqQuery.data() as ChatRequestData;

  //       if (data) {
  //         this.getAllConnectedDesigner(data?.manufacturerUid).then(
  //           (designers: any[]) => {
  //             if (designers) {
  //               designers?.forEach((designerConnection, index) => {
  //                 let chatRequest: ChatRequestData = {
  //                   budget: data?.budget,
  //                   designerUid: designerConnection?.desginger_uid,
  //                   images: data?.images,
  //                   interestedInOtherGood: data?.interestedInOtherGood,
  //                   isAccepted: false,
  //                   isBlocked: true,
  //                   isFirstTime: false,
  //                   manufacturerUid: data?.manufacturerUid,
  //                   prev_designer_uid: this.selectedContact.uid,
  //                   productId: data?.productId,
  //                   text: data?.text,
  //                   userUid: data?.userUid,
  //                   timestamp: data?.timestamp,
  //                   commision: "",
  //                 };
  //                 this.sendRequest(
  //                   this.me.uid,
  //                   designerConnection.desginger_uid,
  //                   chatRequest
  //                 ).then(() => {
  //                   if (designers.length - 1 == index) {
  //                     this.closeMessage();
  //                   }
  //                   console.log("requested");
  //                 });
  //               });
  //             }
  //           }
  //         );
  //       } else {
  //         console.log(data);
  //       }
  //     });
  // }
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

  requestAgain() {
    this.storage.removeOutsideUser().then(() => {
      window.close();
    });
  }
}
