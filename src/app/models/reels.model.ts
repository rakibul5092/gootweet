import { User } from "./user";

export interface Reel {
  id: string;
  about: string;
  uid: string;
  owner: User;
  likeCount: number;
  commentCount: number;
  viewCount: number;
  followCount: number;
  thumb: string;
  videoUrl: string;
  asset?: any;
  timestamp: any;
}

export interface CommentBase {
  from: User;
  body: string;
  timestamp: any;
  type: number;
  id: string;
  likeCount: number;
}
export interface ReelCommentReply extends CommentBase {
  commentID: string;
}
export interface ReelComment extends CommentBase {
  replies: ReelCommentReply[];
}

export interface ReelLike {
  id: string;
  likedBy: User;
  timestamp: any;
}
