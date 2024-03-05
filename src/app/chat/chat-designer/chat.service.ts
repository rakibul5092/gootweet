import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  QueryDocumentSnapshot,
} from "@angular/fire/compat/firestore";
import { Router } from "@angular/router";
import { NavController, PopoverController } from "@ionic/angular";
import { BehaviorSubject, Subscription, lastValueFrom } from "rxjs";
import { first, map, tap } from "rxjs/operators";
import { DesignerCartListPopupPage } from "src/app/components/popovers/designer-cart-list-popup/designer-cart-list-popup.page";
import {
  BASE_URL,
  cart,
  chat_requests,
  connections,
  conversations,
  files_base,
  messages,
  products,
  users,
} from "src/app/constants";
import { ChatRequest, ChatRequestData } from "src/app/models/chat-request";
import { ConnectionDesignerData } from "src/app/models/connection";
import { LastMessage, Message, MessageData } from "src/app/models/message";
import {
  Product,
  ProductForCart,
  ProductForChat,
} from "src/app/models/product";
import { User } from "src/app/models/user";
import { WallPostForChat } from "src/app/models/wall-test";
import { getTimestamp, getUser } from "src/app/services/functions/functions";
import { ScreenService } from "src/app/services/screen.service";
import { UtilityService } from "src/app/services/utility.service";
import { AwsUploadService } from "../../services/aws-upload.service";
import { ToastNotificationService } from "src/app/components/popovers/notifications/toast-notification/toast-notification.service";
import { LoginService } from "src/app/services/login.service";
import { CallService } from "src/app/components/calls/call.service";
import { IncomingCall, OutgoingCall } from "src/app/models/call.model";

interface ContactsExtended {
  user: ConversationUser;
  sent: boolean;
}

@Injectable({
  providedIn: "root",
})
export class ChatService {
  contacts: BehaviorSubject<ConversationUser[]> = new BehaviorSubject([]);
  contactsForShare: BehaviorSubject<ContactsExtended[]> = new BehaviorSubject(
    []
  );
  callData$: BehaviorSubject<IncomingCall | OutgoingCall> = new BehaviorSubject(
    null
  );
  selectedContact: ConversationUser;
  me: User;
  isSingleChat = false;
  messages: BehaviorSubject<Message[]> = new BehaviorSubject([]);
  // messages: Message[] = [];
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
  productForCart: ProductForCart = null;

  noConversations = false;

  requestList: ChatRequest[] = [];

  contactShareSubs: any;
  contactLoadedCalled = 0;
  constructor(
    private http: HttpClient,
    private firestore: AngularFirestore,
    public util: UtilityService,
    private awsUpload: AwsUploadService,
    private nav: NavController,
    private screen: ScreenService,
    private popoverController: PopoverController,
    private router: Router,
    private toastNotificationService: ToastNotificationService,
    private loginService: LoginService,
    private callService: CallService
  ) {}

  isLoading = true;
  initConversationForShare() {
    this.contactsForShare.next([]);
    this.loginService.getUser().then((user: User) => {
      if (user && user.rule === "designer") {
        this.me = user;
        this.contactShareSubs = this.firestore
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
                  user: doc.data() as ConversationUser,
                };
                return temp;
              });
            })
          )
          .subscribe((data) => {
            if (data.length == 0) {
              this.noConversations = true;
            } else {
              this.contactsForShare.next(data as ContactsExtended[]);
            }
            this.isLoading = false;
          });
      }
    });
  }
  initConversationList() {
    if (this.contacts.value.length > 0) {
      return;
    }
    this.contacts.next([]);
    this.loginService.getUser().then((user: User) => {
      if (user && user.rule === "designer") {
        this.me = user;
        this.checkAvailable();
        this.getRequests();
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
                return doc.payload.doc.data() as ConversationUser;
              });
            })
          )
          .subscribe((data) => {
            if (data.length == 0) {
              this.noConversations = true;
            } else {
              this.contacts.next(data as ConversationUser[]);
            }
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
            this.isLoading = false;
          });
      }
    });
  }

  openMessage(contact: any) {
    this.beforeInit(contact);
  }
  public openMessageWithCall(
    contact: User,
    callData: IncomingCall | OutgoingCall
  ) {
    this.callData$.next(callData);
    this.openMessage(contact);
  }
  beforeInit(contact: any) {
    this.selectedContact = contact;
    if (this.screen.width.value < 768) {
      this.nav.navigateForward("designer-conversations/single-chat");
    }
    this.getCartLength();

    this.isSingleChat = true;

    this.initChat(contact);
    setTimeout(() => {
      this.scroll();
    }, 500);
  }
  msgs: Subscription;
  tempMsgs: Message[] = [];
  messageCollection: AngularFirestoreCollection<MessageData>;
  chatDoc: AngularFirestoreDocument;
  myConversationDoc: AngularFirestoreDocument;
  othersConversationDoc: AngularFirestoreDocument;
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
    // this.messages.next([]);
    let chatRoom =
      "chat_" +
      (this.me.uid < contact.uid
        ? this.me.uid + "_" + contact.uid
        : contact.uid + "_" + this.me.uid);
    this.chatRoom = chatRoom;

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
        data.forEach((d) => {
          this.tempMsgs.unshift(d);
        });
      });
  }

  timestamp: any;
  async startWaitTimer() {
    this.timestamp = getTimestamp();
    await this.firestore
      .collection(messages)
      .doc(this.chatRoom)
      .set(
        { warning: { show: false, timestamp: this.timestamp } },
        { merge: true }
      );
    const url =
      " https://europe-west2-furniin-d393f.cloudfunctions.net/updateWaitWarning?chat_doc=" +
      this.chatRoom +
      "&timestamp=" +
      this.timestamp;
    this.http
      .get(url)
      .pipe(first())
      .subscribe((res) => {});
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

  async sendCartAsMessage(url: string) {
    let message: MessageData = {
      from: this.me.uid,
      to: this.selectedContact?.uid,
      isRead: false,
      product: null,
      body: url,
      timeStamp: getTimestamp(),
      mime: "",
      images: [],
      postId: this.selectedPost ? this.selectedPost.id : "",
      productOwnerUid: "",
      productId: "",
      type: 8,
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
    // this.firestore
    //   .collection(messages)
    //   .doc(this.chatRoom)
    //   .set({ lastMessage: lastMessage, warning: { show: false } });
    // this.unreadCountUpdate(1, this.selectedContact.uid);
    this.messageText = "";
    this.selectedPost = null;
    this.selectedProduct = null;
  }
  openUrl(url: string) {
    window.open(url, "_blank");
  }

  sendMessageFromMobilePopup(contact: ConversationUser) {
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
      product: this.selectedProduct?.data ? this.selectedProduct.data : null,
      postId: this.selectedPost ? this.selectedPost.id : "",
      productOwnerUid: this.selectedProduct
        ? this.selectedProduct?.owner?.uid
        : "",
      productId: this.selectedProduct ? this.selectedProduct.id : "",
      type: type,
    };

    let lastMessage: LastMessage = message as LastMessage;
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
    this.messageText = "";
    if (!fromPopup) {
      this.selectedPost = null;
      this.selectedProduct = null;
    }

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
  shouldScroll = true;
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
    this.isSingleChat = false;
    if (this.messageListener) {
      this.messageListener.unsubscribe();
    }
    if (this.fileUploadSubscription) {
      this.fileUploadSubscription.unsubscribe();
      this.isUploading = false;
    }
    this.scrollView = null;
    this.prevQuery = null;
    if (this.msgs) {
      this.msgs.unsubscribe();
    }
  }

  closeMessage() {
    this.isSingleChat = false;
    this.selectedContact = null;
    if (this.messageListener) {
      this.messageListener?.unsubscribe();
    }
    if (this.fileUploadSubscription) {
      this.fileUploadSubscription?.unsubscribe();
      this.isUploading = false;
    }
    this.selectedContact = null;
    this.toastNotificationService.setNotification(null);
    if (this.msgs) {
      this.msgs.unsubscribe();
    }
  }

  ngOnDestroy() {
    if (this.contactShareSubs) {
      this.contactShareSubs?.unsubscribe();
    }
    this.contactLoadedCalled = 0;
    if (this.reqSubscription) {
      this.reqSubscription.unsubscribe();
    }
    if (this.availableSubs) {
      this.availableSubs.unsubscribe();
    }
    if (this.cartLengthSubs) {
      this.cartLengthSubs.unsubscribe();
    }
    this.contacts.next([]);
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
      .then((res: any) => {
        const imgUrl = files_base + name;
        this.sendMessage(imgUrl, this.image.format, false);
        setTimeout(() => {
          this.isUploading = false;
        }, 500);
      })
      .catch((err) => console.log(err));
  }

  upload(postData: any) {
    const end = "upload_file.php";
    return this.http.post(BASE_URL + end, postData);
  }

  playAudio() {
    // var sound = new Howl({
    //   src: ["../../../assets/sounds/request.mp3"],
    //   onerror: (err) => {
    //     console.log(err);
    //   },
    //   onplay: () => {},
    // });
    // sound.play();
  }
  tempCount = 0;
  isFirstTime = true;
  requestCalled = false;
  reqSubscription: any;
  getRequests() {
    if (!this.requestCalled) {
      this.requestCalled = true;
    } else {
      return;
    }
    if (this.reqSubscription) {
      this.reqSubscription.unsubscribe();
    }
    this.isFirstTime = true;
    this.reqSubscription = this.firestore
      .collection(chat_requests)
      .doc(this.me.uid)
      .collection(chat_requests, (ref) =>
        ref.where("isAccepted", "==", false).orderBy("timestamp", "asc")
      )
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            let data: ChatRequestData = a.payload.doc.data() as ChatRequestData;
            let id = a.payload.doc.id;

            let request: ChatRequest = {
              data: data,
              product: null,
              id: id,
              shortened: true,
            };
            return request;
          });
        })
      )
      .subscribe((data) => {
        this.tempCount = this.requestList ? this.requestList.length : 0;
        if (this.tempCount < data.length) {
          if (this.isFirstTime) {
            this.isFirstTime = false;
          } else {
            this.playAudio();
          }
        }
        this.requestList = data;
      });
  }

  requestProcessing = false;
  async requestAccept(req: ChatRequest) {
    if (this.requestProcessing) {
      return;
    } else {
      this.requestProcessing = true;
    }
    await this.util.present("Please wait...");
    if (req?.data?.productId) {
      this.firestore
        .collection(products)
        .doc(req?.data.manufacturer.uid)
        .collection(products)
        .doc(req?.data.productId)
        .get()
        .pipe(first())
        .subscribe(
          (query) => {
            let product = query.data() as Product;

            this.afterAcceptRequest(req, product);
          },
          async (err) => {
            await this.util.dismiss();
          }
        );
    } else {
      this.afterAcceptRequest(req, null);
    }
  }

  async afterAcceptRequest(req, product) {
    let chatRoom =
      "chat_" +
      (this.me.uid < req.data.user?.uid
        ? this.me.uid + "_" + req.data.user?.uid
        : req.data.user?.uid + "_" + this.me.uid);

    let message4: MessageData = {
      from: req.data.user?.uid,
      to: this.me.uid,
      isRead: false,
      body: req.data.text,
      product: null,
      timeStamp: getTimestamp(),
      mime: "",
      images: [],
      postId: "",
      productId: "",
      productOwnerUid: "",
      type: 1,
    };

    let message3: MessageData = {
      from: req.data.user?.uid,
      to: this.me.uid,
      isRead: false,
      body: "",
      product: product,
      timeStamp: getTimestamp(),
      mime: "",
      images: [],
      postId: "",
      productId: req.data.productId,
      productOwnerUid: req.data.manufacturer.uid,
      type: 5,
    };

    let user: ConversationUser = req.data.user as ConversationUser;
    user.manufacturer_uid = req.data.manufacturer.uid;
    let newUser: any = this.me;
    newUser.isNew = true;

    let batch = this.firestore.firestore.batch();

    let conversationColl = this.firestore
      .collection(conversations)
      .doc(this.me.uid)
      .collection(conversations);
    let conversationCol2 = this.firestore
      .collection(conversations)
      .doc(req.data.user?.uid)
      .collection(conversations);

    let messageColl = this.firestore
      .collection(messages)
      .doc(chatRoom)
      .collection(messages);

    if (product) {
      batch.set(messageColl.ref.doc(), message3);
    }

    if (req.data.text && req.data.text.trim().length > 0) {
      batch.set(messageColl.ref.doc(), message4);
    }

    let lastMessage: LastMessage = message4 as LastMessage;
    lastMessage.notified = false;
    newUser.lastMessage = lastMessage;
    user.lastMessage = lastMessage;

    batch.set(conversationColl.doc(req.data.user?.uid).ref, user);
    batch.set(conversationCol2.doc(this.me.uid).ref, newUser);
    batch.update(
      this.firestore
        .collection(chat_requests)
        .doc(this.me.uid)
        .collection(chat_requests)
        .doc(req.data.user.uid).ref,
      { isAccepted: true }
    );
    await batch
      .commit()
      .then(async () => {
        this.requestProcessing = false;
        await this.util.dismiss();

        this.openMessage(req.data.user);
      })
      .catch(async (err) => {
        await this.util.dismiss();
      });
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
  async cancelRequest(uid: string) {
    await this.firestore
      .collection(chat_requests)
      .doc(this.me.uid)
      .collection(chat_requests)
      .doc(uid)
      .delete()
      .catch(() => {
        this.util.showAlert(
          "Deleted",
          "Already deleted! please wait for update."
        );
      });
  }

  closePost() {
    this.selectedPost = null;
    this.selectedProduct = null;
  }

  isOnline = false;
  availableSubs: Subscription;
  checkAvailable() {
    this.availableSubs = this.firestore
      .collection("available")
      .doc(this.me.uid)
      .snapshotChanges()
      .subscribe((query) => {
        if (query) {
          let data: any = query.payload.data();
          this.isOnline = data?.available;
        } else {
          this.isOnline = false;
        }
      });
  }

  async setIsAvailable(value: boolean) {
    await this.firestore
      .collection("available")
      .doc(this.me.uid)
      .set({ available: value });
  }

  cartLength = 0;
  cartLengthSubs: any;
  getCartLength() {
    if (this.cartLengthSubs) {
      this.cartLengthSubs.unsubscribe();
    }
    if (this.selectedContact && this.me) {
      this.cartLengthSubs = this.firestore
        .collection("cart")
        .doc(this.selectedContact?.uid)
        .collection(products, (ref) =>
          ref
            .where("isDesigner", "==", true)
            .where("designerId", "==", this.me.uid)
        )
        .snapshotChanges()
        .subscribe((cartQuery) => {
          this.cartLength = cartQuery.length;
        });
    }
  }

  async openCartPopover(event: any) {
    // this.productPopup = true;
    let data = {
      isDesigner: true,
      user_info: this.selectedContact,
    };
    let popover = await this.popoverController.create({
      component: DesignerCartListPopupPage,
      event: event,
      componentProps: data,
      cssClass: "designer-cart-pop",
    });

    popover.onDidDismiss().then((res: any) => {
      if (res && res.data) {
        this.sendCartAsMessage(res?.data);
      }
    });
    return await popover.present();
  }

  navigateToManufacturerCatalog(manufacturerUid: string) {
    this.router.navigate([`profile/manufacturer/${manufacturerUid}/catalog`]);
  }

  async addToCart(contact: ConversationUser) {
    return await this.firestore
      .collection(cart)
      .doc(contact.uid)
      .collection(products)
      .add(this.productForCart)
      .then(async () => {
        await this.util.showToast("Prekė įdėta į krepšelį", "success");
      })
      .catch(async (err) => {
        console.log("add to cart error: ", err);
        await this.util.showToast("Bandykite dar kartą...", "error");
      });
  }
  req1: ChatRequestData = {
    budget: 0,
    commission: "5",
    designerUid: "",
    images: [],
    interestedInOtherGood: false,
    isAccepted: false,
    isBlocked: false,
    isFirstTime: false,
    manufacturer: {
      status: "",
      address: "",
      category: "3",
      cover_photo: "",
      details: {
        address: "Taikos pr. 98, Klaipėda 94198, Lietuva",
        bank_name: "",
        brand_name: "Senoji baldinė",
        company_code: "305579814",
        company_name: "Senoji baldinė",
        email: "senoji.baldine.klaipeda@gmail.com",
        iban: "LT764010051002027298",
        pvm_code: "LT100014018517",
        selected_countries: [
          {
            flag: "https://restcountries.eu/data/ltu.svg",
            name: "Lithuania",
          },
        ],
        selected_type: "Gamintojas1",
        signed_doc: "",
        telephone_no: "+37066584977",
      },
      email: "senoji.baldine.klaipeda@gmail.com",
      emailVerified: true,
      fb_id: "",
      full_name: {
        first_name: "Senoji",
        last_name: "baldine",
      },
      google_id: "",
      is_first_time: false,
      lastMessage: null,
      phone: "",
      profile_photo: "cL6CiA6oL8ciYm04aQjMwd2COiE2_1621766498027.webp",
      rule: "manufacturer",
      uid: "cL6CiA6oL8ciYm04aQjMwd2COiE2",
      unread_message: 0,
    },
    prev_designer_uid: "",
    productId: "9gOrtM7aFDQbfjNBxsEr",
    text: "sveiki, o kitos spalvos galimas pasirinkimas sio baldo? Noreciau sviesios spalvos. Gal veliuro. Dar klausimas kiek kainuotu uznesimas ir atvezimas. Mazeikiai miestas/2 aukstas. ",
    timestamp: "",
    user: {
      status: "",
      address: "",
      category: "",
      cover_photo: "",
      details: {
        telephone_no: "867528838",
      },
      email: "jurgita.molyte30@gmail.com",
      emailVerified: true,
      fb_id: "",
      full_name: {
        first_name: "Jurgita ",
        last_name: "nesvarbu",
      },
      google_id: "",
      is_first_time: false,
      lastMessage: null,
      phone: "",
      profile_photo: "",
      rule: "user",
      uid: "GL5oU1noKBQdjqWwkklGQJ7vTF82",
      unread_message: 0,
    },
  };
}

interface ConversationUser extends User {
  manufacturer_uid: string;
}
