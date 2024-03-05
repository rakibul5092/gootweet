import {Component, OnInit} from "@angular/core";
import {PopoverController} from "@ionic/angular";
import {User} from "src/app/models/user";
import {getUser} from "../../../../services/functions/functions";

@Component({
  selector: "app-api-instructions",
  templateUrl: "./api-instructions.page.html",
  styleUrls: ["./api-instructions.page.scss"],
})
export class ApiInstructionsPage implements OnInit {
  me: User;

  constructor(private popoverController: PopoverController) { }

  ngOnInit() {
    getUser().then((user: User) => {
      if (user) {
        this.me = user;
      }
    });
  }

  dismiss() {
    this.popoverController.dismiss();
  }

  structure = `
  {
    "api_key": "API_KEY",
    "baseUrl": "https://your-website.com",    // base url for material image to upload(without image name, only image path)
    "materials":  [
        {
            "name": "Noe",           // Audinio Pavadinimas //
            "category": "Wood",     // Audinio Kategorija //
            "sub_category": "wood sub",  // Audinio subkategorija (optional) //
            "images": "image-folder/ingo-table-pine__0737092_PE740877_S5.JPG"    // Audinio Nuotrauka //
            "code": "wood34d",  // Audinio kodas //
        }
       
    ]
}

`;

  responseSuccess = `{
  error: false,
  status: 'done',
  materials: [],

}`;
  responseFailed = `{
  error: true
  status: 'unauthenticated',
}`;
}
