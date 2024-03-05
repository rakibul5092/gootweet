import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { lastValueFrom } from "rxjs";
import { first } from "rxjs/operators";
import { bank_info, users } from "src/app/constants";
import { User } from "src/app/models/user";
import { BankInfo } from "src/app/models/wallet";
import { LoginService } from "src/app/services/login.service";
import { UtilityService } from "src/app/services/utility.service";

@Injectable({
  providedIn: "root",
})
export class SettingsService {
  public me: User;
  public bankInfo: BankInfo;
  public uid: string;
  constructor(
    private loginService: LoginService,
    private firestore: AngularFirestore,
    private fireAuth: AngularFireAuth,
    private utilService: UtilityService
  ) {
    this.initUser();
  }
  async initUser() {
    if (!this.me) {
      this.me = await this.loginService.getUser();
    }
    return this.me;
  }

  async updateUserData() {
    try {
      await this.utilService.present("Prisijungiama...");
      await this.firestore.collection(users).doc(this.me.uid).update(this.me);
      await this.utilService.dismiss();
      await this.utilService.showToast("Successfully updated.", "success");
    } catch (err) {
      await this.failed(err);
    }
  }

  async updateBankInfo(data: BankInfo) {
    try {
      this.me.details = {
        ...this.me.details,
        ...data,
        iban: data.account_no,
      };
      await this.utilService.present("Prisijungiama...");
      await this.firestore.collection(users).doc(this.me.uid).update(this.me);
      await this.firestore.collection(bank_info).doc(this.uid).set(data);
      await this.utilService.dismiss();
      await this.utilService.showToast("Successfully updated.", "success");
    } catch (err) {
      await this.failed(err);
    }
  }

  async getBankInfo() {
    this.uid = (await lastValueFrom(this.fireAuth.authState.pipe(first()))).uid;
    const doc = await lastValueFrom(
      this.firestore.collection(bank_info).doc(this.uid).get()
    );
    if (doc.exists) {
      this.bankInfo = doc.data() as BankInfo;
    } else {
      this.bankInfo = null;
    }
    return this.bankInfo;
  }

  async updatePassword(currentPass: string, newPassword: string) {
    try {
      await this.utilService.present("Prisijungiama...");
      const currentUser = await this.fireAuth.currentUser;
      await this.fireAuth.signInWithEmailAndPassword(
        currentUser.email,
        currentPass
      );
      await currentUser.updatePassword(newPassword);
      await this.utilService.showToast("Successfully updated.", "success");
      await this.utilService.dismiss();
    } catch (err) {
      await this.failed(err);
    }
  }

  async failed(err: any) {
    await this.utilService.dismiss();
    await this.utilService.showAlert("Error", err.message);
    await this.utilService.showToast("Failed to update", "danger");
  }
}
