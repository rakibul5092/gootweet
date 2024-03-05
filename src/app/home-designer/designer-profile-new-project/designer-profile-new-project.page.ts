import { Component, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { VisibleService } from "src/app/chat/chat-designer/visible.service";
import { MessengerService } from "src/app/services/messenger.service";
import { portfolio } from "../../constants";
import { Portfolio } from "../../models/portfolio";
import { Image } from "../../models/product";
import { User } from "../../models/user";
import { AwsUploadService } from "../../services/aws-upload.service";
import { getTimestamp, getUser } from "../../services/functions/functions";
import { GotoProfileService } from "../../services/goto-profile.service";
import { LoginService } from "../../services/login.service";
import { UtilityService } from "../../services/utility.service";

@Component({
  selector: "app-designer-profile-new-project",
  templateUrl: "./designer-profile-new-project.page.html",
  styleUrls: ["./designer-profile-new-project.page.scss"],
})
export class DesignerProfileNewProjectPage implements OnInit {
  header = "";
  description = "";
  checked = false;
  isImageAdded = false;
  me: User;
  images: string[];
  imageData: Image[];

  constructor(
    private utils: UtilityService,
    private loginService: LoginService,
    private firestore: AngularFirestore,
    private awsUpload: AwsUploadService,
    private visible: VisibleService,
    private messengerService: MessengerService,
    private gotoProfileService: GotoProfileService
  ) {}

  ngOnInit() {
    this.images = [];
    this.imageData = [];
    getUser().then((user: User) => {
      this.me = user;
      if (!this.visible.isLoaded) {
        this.messengerService.openMessenger(this.me);
        this.visible.isLoaded = true;
      }
    });
  }

  finalUpload() {
    if (
      this.header.trim() !== "" &&
      this.description.trim() !== "" &&
      this.isImageAdded != false
    ) {
      this.checked = false;
      let time = getTimestamp();
      let portfolioData: Portfolio = {
        description: this.description,
        header: this.header,
        images: this.images,
        timestamp: time,
      };
      this.loginService.present("Adding portfolio...").then(() => {
        let uploaded = 0;
        this.imageData.forEach((img) => {
          this.awsUpload
            .uploadImage("portfolio_photos", img.name, img.base64String)
            .then((res: any) => {
              uploaded++;
              if (uploaded == this.imageData.length) {
                this.firestore
                  .collection(portfolio)
                  .doc(this.me.uid)
                  .collection(portfolio)
                  .add(portfolioData)
                  .then(() => {
                    this.loginService.dismiss().then(() => {
                      this.utils.showToast("Added successfully", "success");
                      this.gotoProfileService.gotoProfile(this.me);
                    });
                  })
                  .catch((err) => {
                    console.log(err);
                    this.loginService.dismiss();
                  });
              }
            })
            .catch(async (err) => {
              await this.loginService.dismiss();
            });
        });
      });
    } else {
      this.checked = true;
    }
  }

  onBrowseImage(event: any) {
    for (let i = 0; i < event.target.files.length; i++) {
      let imageFile = event.target.files[i];
      let reader = new FileReader();
      reader.onload = (e: any) => {
        let imageName = this.makeName("webp", this.me.uid);
        let image = {
          imageForView: e.target.result,
          base64String: e.target.result,
          format: "webp",
          name: imageName,
        };
        this.imageData.push(image);
        this.images.push(imageName);
        this.isImageAdded = true;
      };
      reader.readAsDataURL(imageFile);
    }

    // this.openImageCropper(event);
  }

  //Image cropper popover here

  makeName(mimeType: string, uid: any): string {
    const timestamp = new Date().getTime();
    return uid + "_portfolio_photo_" + timestamp + "." + mimeType;
  }
}
