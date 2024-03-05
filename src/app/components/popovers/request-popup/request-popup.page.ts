import { Component, OnInit } from "@angular/core";
import { ModalController, NavParams } from "@ionic/angular";
import { first } from "rxjs/operators";
import { ChatsService } from "src/app/chats/chats.service";
import { ChatRequestData } from "src/app/models/chat-request";
import { Image, Product } from "src/app/models/product";
import { User } from "src/app/models/user";
import { WallPost } from "src/app/models/wall-test";
import { inTime } from "src/app/services/functions/pipe-functions";
import { HttpRequestsService } from "src/app/services/http-requests.service";
import { RequestServiceService } from "src/app/services/request-service.service";
import { UtilityService } from "src/app/services/utility.service";
import { getTimestamp, getUser } from "../../../services/functions/functions";

@Component({
  selector: "app-request-popup",
  templateUrl: "./request-popup.page.html",
  styleUrls: ["./request-popup.page.scss"],
})
export class RequestPopupPage implements OnInit {
  isLoggedIn = false;
  me: User;
  wallPost: WallPost;
  productOwner: User;

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
  mainProduct: Product = null;
  chatRequestImagesData: Image[] = [];
  index: number = 0;

  constructor(
    private requestService: RequestServiceService,
    private navParams: NavParams,
    private utils: UtilityService,
    private httpService: HttpRequestsService,
    private modalController: ModalController,
    private chatsService: ChatsService
  ) {}

  ngOnInit() {
    if (this.navParams.data && !this.navParams.get("isSingleProduct")) {
      this.wallPost = this.navParams.get("walPost");
      this.productOwner = this.wallPost?.data?.owner;
      this.index = Number(this.navParams.get("index"));
      this.chatRequest.manufacturer = this.wallPost?.data?.owner;
      this.mainProduct = this.wallPost?.data?.products[this.index];
    } else if (this.navParams.data && this.navParams.get("isSingleProduct")) {
      this.productOwner = this.navParams.get("productOwner");
      this.chatRequest.manufacturer = this.productOwner;
      this.mainProduct = this.navParams.get("product");
    }
    getUser().then((user: User) => {
      if (user) {
        this.me = user;
        this.isLoggedIn = true;
        this.chatRequest.user = user;
        this.getPreviousDesignerInformation();
      } else {
        this.isLoggedIn = false;
      }
    });
    this.chatRequest.productId = this.mainProduct?.id;
  }
  openMessage(designer: User) {
    this.modalController.dismiss().then(() => {
      this.chatsService.openMessage(designer);
    });
  }
  sending = false;
  sendRequest() {
    this.sending = true;
    this.chatRequest.designerUid = "";
    this.chatRequest.timestamp = getTimestamp();
    let timeFlag = inTime();
    this.requestService
      .getAverageCommission(this.chatRequest.manufacturer?.uid)
      .then((avg) => {
        this.chatRequest.commission = avg + "";
        this.httpService
          .insertDesignerRequest(this.chatRequest, timeFlag)
          .pipe(first())
          .subscribe((res: any) => {
            if (res.status) {
              this.utils.showToast("Užklausa išsiūsta!", "success").then(() => {
                this.modalController.dismiss();
              });
            } else {
              this.utils
                .showToast("Nepavyko išsiųsti užklausos!", "danger")
                .then(() => {
                  this.modalController.dismiss();
                });
            }
          });
      })
      .catch((err) => {
        this.utils.showAlert("Error!", err);
      });
  }

  previousConversations: User[] = [];
  getPreviousDesignerInformation() {
    this.requestService
      .getPreviousDesigner(
        this.chatRequest.manufacturer.uid,
        this.chatRequest.user.uid
      )
      .pipe(first())
      .subscribe(
        (res) => {
          if (res.status) {
            this.previousConversations = res.data;
            if (this.previousConversations.length > 0) {
              if (this.chatsService.contacts.value.length == 0) {
                this.chatsService.initConversationList();
              }
            }
          }
        },
        (err) => {
          console.log(err);
        }
      );
  }

  dismiss() {
    this.modalController.dismiss();
  }
  // editor: AngularEditorConfig = {
  //   editable: true,
  //   spellcheck: true,
  //   height: "15rem",
  //   minHeight: "5rem",
  //   placeholder: "Jūsų komentaras...",
  //   translate: "no",
  //   defaultParagraphSeparator: "p",
  //   defaultFontName: "Arial",
  //   toolbarHiddenButtons: [["bold"]],
  // };
}
