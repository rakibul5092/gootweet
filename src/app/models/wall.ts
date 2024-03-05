import {
  CollectionReference,
  DocumentReference,
} from "@angular/fire/compat/firestore";
import { Product } from "./product";
import { User } from "./user";
import { Country } from "./wall-post";

export interface WallPost {
  id: string;
  ref: DocumentReference;
  data: WallPostData;
  isFollowed: boolean;
  owner: User;
  products: Product[];
  shortened: boolean;
}
export interface WallPostData {
  title: string;
  description: string;
  countries: Country[];
  productsIds: string[];
  images: string[];
  imageTab: number;
  timestamp: any;
  ownerUid: string;
  isWorkerNeeded: boolean;
  isDesignerNeeded: boolean;
}

// export interface Comment {
//   id: string;
//   commenter_data: CommenterData;
//   comment: CommentData;
//   replyComments: ReplyComment[];
// }

// export interface CommentData {
//   commenter_uid: string;
//   comment_text: string;
//   timestamp: any;
// }
// export interface CommenterData {
//   uid: string;
//   full_name: {
//     first_name: string;
//     last_name: string;
//   };
//   profile_photo: string;
//   role: string;
// }

// export interface ReplyCommentData {
//   commenter_uid: string;
//   comment_text: string;
//   timestamp: any;
// }
// export interface ReplyComment {
//   id: string;
//   reply_comment_data: ReplyCommentData;
//   commenter_data: CommenterData;
// }
