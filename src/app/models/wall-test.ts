import { AngularFirestoreCollection } from "@angular/fire/compat/firestore";
import { Image, Product } from "./product";
import { User } from "./user";
import { Country } from "./wall-post";

export interface PopoverVideo {
  index: number;
  isSet: boolean;
}

export interface WallPost {
  id: string;
  data: WallPostData;
  myUid: string;
  shortened: boolean;
  isCommentAll: boolean;
  comments: Comment[];
  commentText: string;
  commentForEdit: Comment;
  reacted?: { icon: string; type: number; reactor_uid: string; timestamp: any };
  gif?: string;
  commentType?: number;
  whoTyping: { name: string; uid: string };
  collection: AngularFirestoreCollection<WallPostData>;
  userCollection: AngularFirestoreCollection<WallPostData>;
}

export interface WallPostForChat {
  id: string;
  data: WallPostData;
}

export interface WallPostData {
  title: string;
  description: string;
  countries: Country[];
  products: Product[];
  files: { url: string; thumbnail?: any; type: string }[];
  liveStatus?: number;
  sid?: string;
  timestamp: any;
  metaData?: Meta;
  convertedTime: string;
  owner: User;
  productsIds: string[];
  isWorkerNeeded: boolean;
  isDesignerNeeded: boolean;
  isPaid: boolean;
  type: number;
  reactions?: React[];
  reactionCounts?: number;
  commentCounts?: number;
  button1Text?: string;
  button2Text?: string;
  layout?: number;
}

export interface wallpostFile {
  dataForView: any;
  thumbName?: string;
  thumbnail?: any;
  format: string;
  name: string;
  type: string;
}
export interface Meta {
  siteName: string;
  title: string;
  img: string;
  description: string;
  url: string;
}

export interface DesignerWallPost {
  id: string;
  data: DesignerWallPostData;
  isFollowed: boolean;
  owner: User;
  shortened: boolean;
  isCommentAll: boolean;
  comments: Comment[];
  reactions: React[];
  commentText: string;
  commentForEdit: Comment;
  whoTyping: { name: string; uid: string };
}
export interface DesignerWallPostData {
  title: string;
  description: string;
  countries: Country[];
  images: string[];
  timestamp: any;
  owner: User;
}

export interface Comment {
  id: string;
  comment_data: CommentData;
  commenter_info: CommenterInfo;
  reply_comments: ReplyComment[];
  replyTo: Comment;
  replyCommentText: string;
  replyCommentForEdit: ReplyComment;
  type?: number;
  gif?: string;
}
export interface CommentData {
  comment_id: string;
  comment_text: string;
  commenter_uid: string;
  timestamp: any;
  converted_time: string;
  type?: number;
  gif?: string;
}

export interface ReplyComment {
  id: string;
  reply_comment_data: ReplyCommentData;
  commenter_info: CommenterInfo;
}

export interface ReplyCommentData {
  comment_text: string;
  commenter_uid: string;
  timestamp: any;
  converted_time: string;
  type?: number;
  gif?: string;
}

export interface CommenterInfo {
  uid: string;
  full_name: {
    first_name: string;
    last_name: string;
  };
  profile_photo: string;
  rule: string;
  status: string;
  isDesigner: boolean;
}

export interface React {
  id: string;
  react_data: ReactData;
  reactor_info: ReactorInfo;
}
export interface ReactData {
  reaction: number;
  reactor_uid: string;
  timestamp: any;
}
export interface ReactorInfo {
  uid: string;
  full_name: {
    first_name: string;
    last_name: string;
  };
  profile_photo: string;
  role: string;
}
