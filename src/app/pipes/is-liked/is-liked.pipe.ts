import { Pipe, PipeTransform } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { lastValueFrom } from "rxjs";
import { REELS, REELS_LIKES } from "src/app/constants";

@Pipe({
  name: "isLiked",
  pure: true,
})
export class IsLiked implements PipeTransform {
  constructor(private firestore: AngularFirestore) {}
  async transform(reelId: string, myUid: string): Promise<string> {
    if (myUid) {
      const query = await lastValueFrom(
        this.firestore
          .collection(REELS)
          .doc(reelId)
          .collection(REELS_LIKES)
          .doc(myUid)
          .get()
      );
      return query.exists ? "red" : "white";
    } else {
      return "white";
    }
  }
}
