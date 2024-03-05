import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import * as CircularJson from "circular-json";
import { lastValueFrom } from "rxjs";
import { first, take } from "rxjs/operators";
import {
  cloud_function_base_url,
  comments,
  followed,
  NOTIFICATION_TYPE,
  reactions,
  reply_comments,
  users,
  wallpost,
} from "src/app/constants";
import { Product } from "src/app/models/product";
import { User } from "src/app/models/user";
import {
  Comment,
  CommentData,
  ReactData,
  ReplyCommentData,
  WallPost,
} from "src/app/models/wall-test";
import { NotificationData } from "../../models/notifications";

@Injectable({
  providedIn: "root",
})
export class PostService {
  constructor(private firestore: AngularFirestore, private http: HttpClient) {}

  async getOwnerInfo(ownerUid: string): Promise<User> {
    return await lastValueFrom(
      this.firestore.collection(users).doc(ownerUid).get()
    ).then((query: any) => {
      let user: User = query.data() as User;
      return user;
    });
  }
  getRandomProducts() {
    return this.http.get(cloud_function_base_url + "/getCategorizedProducts");
  }
  async getFollow(myUid: string, ownerUid: string): Promise<boolean> {
    if (myUid) {
      return await lastValueFrom(
        this.firestore
          .collection(followed)
          .doc(myUid)
          .collection(followed, (ref) => ref.where("uid", "==", ownerUid))
          .get()
      ).then((values) => {
        if (values.docs.length > 0) {
          return true;
        } else {
          return false;
        }
      });
    }
  }

  getProducts(ownerUid: string, productIds: string[]) {
    let products: Product[] = [];
    productIds?.forEach((productId) => {
      this.firestore
        .collection("products")
        .doc(ownerUid)
        .collection("products")
        .doc(productId)
        .get()
        .pipe(first())
        .subscribe((query) => {
          let id = query.id;
          let pData = query.data();
          let product: Product = {
            id: id,
            product_id: pData?.product_id,
            title: pData?.title,
            category: pData?.category,
            sub_category: pData?.sub_category,
            inner_category: pData?.inner_category,
            good: pData?.good,
            description: pData?.description,
            main_images: pData?.main_images,
            measures: pData?.measures,
            delivery_types: pData?.delivery_types,
            delivery_time: pData?.delivery_time ? pData?.delivery_time : "",
            commision: pData?.commision,
            timestamp: pData?.timestamp,
            aditional_images: pData?.aditional_images,
          };
          if (product.title || product.description) {
            products.push(product);
          }
        });
    });

    return products;
  }

  addFollow(myuid: string, uid: string, timestamp: any) {
    return this.firestore
      .collection(followed)
      .doc(myuid)
      .collection(followed)
      .doc(uid)
      .set({ uid: uid, timestamp: timestamp });
  }

  public getMyReaction(wallId: string, myUid: string) {
    return this.firestore
      .collection(wallpost)
      .doc(wallId)
      .collection(reactions)
      .doc<any>(myUid)
      .snapshotChanges();
  }

  public getLiveWallData(wallId: string) {
    return this.firestore.collection(wallpost).doc(wallId).snapshotChanges();
  }

  async react(
    wall_id: string,
    reactor_uid: string,
    reaction: any,
    timestamp: any
  ) {
    let react: ReactData = {
      ...reaction,
      reactor_uid: reactor_uid,
      timestamp: timestamp,
    };
    await this.firestore
      .collection(wallpost)
      .doc(wall_id)
      .collection(reactions)
      .doc(reactor_uid)
      .set(react);
  }

  // comment like part hereeee................................

  sendComments(
    wall_id: string,
    wall_owner_uid: string,
    commenter_uid: string,
    commentText: string,
    timestamp: any,
    me: User,
    commentType: number = 1,
    gif: string = ""
  ) {
    let comment: CommentData = {
      comment_id: "",
      comment_text: commentText,
      commenter_uid: commenter_uid,
      timestamp: timestamp,
      converted_time: "",
      type: commentType,
      gif: gif,
    };
    this.firestore
      .collection(wallpost)
      .doc(wall_id)
      .collection(comments)
      .add(comment)
      .then((docRef) => {
        if (me.uid !== wall_owner_uid) {
          let notificationData: NotificationData = {
            type: NOTIFICATION_TYPE.COMMENT,
            seen: false,
            timestamp: timestamp,
            request_data: null,
            senderInfo: me,
            comment_data: {
              comment_id: docRef.id,
              wall_post_id: wall_id,
              comment_text: commentText,
              commenter_uid: commenter_uid,
              timestamp: timestamp,
              converted_time: "",
              type: commentType,
              gif: gif,
            },
            reaction_data: null,
          };
          this.insertNotification(notificationData)
            .pipe(first())
            .subscribe((res) => {});
        }
      });
  }

  async updateComments(wall: WallPost) {
    let comment: CommentData = {
      comment_id: wall.commentForEdit.id,
      comment_text: wall.commentText,
      commenter_uid: wall.commentForEdit.commenter_info.uid,
      timestamp: wall?.commentForEdit?.comment_data?.timestamp,
      converted_time: "",
    };
    await this.firestore
      .collection(wallpost)
      .doc(wall.id)
      .collection(comments)
      .doc(wall.commentForEdit.id)
      .update(comment);
  }

  async sendReplyComment(
    wall_id: string,
    commenter_uid: string,
    comment_id: string,
    commentText: string,
    timestamp: any,
    commentType = 1,
    gif = ""
  ) {
    let replyComment: ReplyCommentData = {
      comment_text: commentText,
      commenter_uid: commenter_uid,
      timestamp: timestamp,
      converted_time: "",
      type: commentType,
      gif: gif,
    };
    await this.firestore
      .collection(wallpost)
      .doc(wall_id)
      .collection(comments)
      .doc(comment_id)
      .collection(reply_comments)
      .add(replyComment);
  }

  async updateReplyComment(wall: WallPost, comment: Comment) {
    let replyComment: ReplyCommentData = {
      comment_text: comment.replyCommentText,
      commenter_uid: comment.replyCommentForEdit.commenter_info.uid,
      timestamp: comment.replyCommentForEdit.reply_comment_data.timestamp,
      converted_time: "",
    };
    await this.firestore
      .collection(wallpost)
      .doc(wall.id)
      .collection(comments)
      .doc(comment.id)
      .collection(reply_comments)
      .doc(comment.replyCommentForEdit.id)
      .update(replyComment);
  }

  commentTypingFunction(wall: WallPost, name: string, uid: string) {
    const url =
      " https://europe-west2-furniin-d393f.cloudfunctions.net/addCommentTyping?wall_id=" +
      wall.id +
      "&uid=" +
      uid +
      "&name=" +
      name;
    this.http
      .get(url)
      .pipe(first())
      .subscribe(
        (res) => {
          console.log(res);
        },
        (err) => {
          console.log(err);
        }
      );
  }
  commentTyping(wall: WallPost, name: string, uid: string) {
    return this.firestore
      .collection(wallpost)
      .doc(wall.id)
      .collection("typing")
      .doc(wall.id)
      .set({ typing: name, uid: uid });
  }
  insertNotification(notificationData: NotificationData) {
    return this.http.post(
      "https://europe-west2-furniin-d393f.cloudfunctions.net/insertNotification",
      CircularJson.stringify(notificationData)
    );
  }
}
