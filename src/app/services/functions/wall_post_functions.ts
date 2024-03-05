import {
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from "@angular/fire/compat/firestore";
import { first, map } from "rxjs/operators";
import {
  Comment,
  CommentData,
  CommenterInfo,
  React,
  ReactData,
  ReactorInfo,
  ReplyComment,
  ReplyCommentData,
} from "src/app/models/wall-test";
import { convertTime } from "./pipe-functions";
export const getWhoTyping = (typingDoc: AngularFirestoreDocument) => {
  let typing = { name: "", uid: "" };
  let typingSub = typingDoc.snapshotChanges().subscribe((doc) => {
    let data = doc.payload.data();
    typing.name = data?.name;
    typing.uid = data?.uid;
  });
  return typing;
};

export const getReactions = (
  collection: AngularFirestoreCollection<ReactData>,
  userCollection: AngularFirestoreCollection
): React[] => {
  let reacts: React[] = [];

  let reactSub = collection.snapshotChanges().subscribe((query) => {
    reacts.splice(0, reacts.length);
    query.forEach((action) => {
      let reactData: ReactData = action.payload.doc.data() as ReactData;
      let id = action.payload.doc.id;

      let reactorInfo: ReactorInfo = {
        full_name: { last_name: "", first_name: "" },
        uid: "",
        role: "",
        profile_photo: "",
      };
      userCollection
        .doc(reactData.reactor_uid)
        .get()
        .pipe(first())
        .subscribe((userQuery) => {
          let data = userQuery.data();

          reactorInfo.full_name = {
            first_name: data?.full_name?.first_name,
            last_name: data?.full_name?.last_name,
          };
          reactorInfo.profile_photo = data?.profile_photo;
          reactorInfo.role = data?.rule;
          reactorInfo.uid = userQuery.id;
        });
      let react: React = {
        react_data: reactData,
        id: id,
        reactor_info: reactorInfo,
      };
      reacts.push(react);
    });
  });
  return reacts;
};

export const getComments = (
  collection: AngularFirestoreCollection<CommentData>,
  userCollection: AngularFirestoreCollection
): Comment[] => {
  let comments: Comment[] = [];
  collection
    .snapshotChanges()
    .pipe(
      map((actions) => {
        return actions.map((a) => {
          let commentData: CommentData = a.payload.doc.data() as CommentData;
          commentData.converted_time = convertTime(commentData.timestamp);
          let id = a.payload.doc.id;
          let comment: Comment = {
            comment_data: commentData,
            commenter_info: null,
            id: id,
            replyCommentForEdit: null,
            replyCommentText: "",
            replyTo: null,
            reply_comments: [],
          };
          return comment;
        });
      })
    )
    .subscribe((mutatedComments) => {
      mutatedComments.forEach((c) => {
        if (
          comments.find((item: any) => {
            return item.id === c.id;
          })
        ) {
          let index = comments.map((obj: any) => obj.id).indexOf(c.id);
          comments[index].comment_data.comment_text =
            c.comment_data.comment_text;
        } else {
          let commenterInfo: CommenterInfo = {
            full_name: { last_name: "", first_name: "" },
            uid: "",
            rule: "",
            profile_photo: "",
            status: "",
            isDesigner: false,
          };
          userCollection
            .doc(c.comment_data.commenter_uid)
            .get()
            .pipe(first())
            .subscribe((userQuery) => {
              let data = userQuery.data();

              commenterInfo.full_name = {
                first_name: data?.full_name?.first_name,
                last_name: data?.full_name?.last_name,
              };
              if (data?.rule === '"designer"') {
                commenterInfo.profile_photo = data?.profile_photo;
              } else {
                commenterInfo.profile_photo = data?.profile_photo;
              }

              commenterInfo.rule = data?.rule;
              commenterInfo.status = data?.status;
              commenterInfo.uid = userQuery.id;
              commenterInfo.isDesigner = data?.rule === "designer";
            });
          let comment: Comment = {
            comment_data: c.comment_data,
            id: c.id,
            reply_comments: getReplyComments(
              collection
                .doc(c.id)
                .collection<ReplyCommentData>("reply_comments", (ref) =>
                  ref.orderBy("timestamp", "asc")
                ),
              userCollection
            ),
            commenter_info: commenterInfo,
            replyCommentText: "",
            replyTo: null,
            replyCommentForEdit: null,
          };
          comments.push(comment);
        }
      });
    });
  // this.commenSubs.push(commentSub);
  return comments;
};

const getReplyComments = (
  collection: AngularFirestoreCollection<ReplyCommentData>,
  userCollection: AngularFirestoreCollection
): ReplyComment[] => {
  let replyComments: ReplyComment[] = [];
  let replySub = collection
    .snapshotChanges()
    .pipe(
      map((actions) => {
        return actions.map((a) => {
          let replyData: ReplyCommentData =
            a.payload.doc.data() as ReplyCommentData;
          let id = a.payload.doc.id;
          replyData.converted_time = convertTime(replyData.timestamp);
          let replyComment: ReplyComment = {
            commenter_info: null,
            id: id,
            reply_comment_data: replyData,
          };
          return replyComment;
        });
      })
    )
    .subscribe((mutatedReply) => {
      mutatedReply.forEach((r) => {
        if (
          replyComments.find((item) => {
            return item.id === r.id;
          })
        ) {
          let index = replyComments.map((obj) => obj.id).indexOf(r.id);
          replyComments[index].reply_comment_data.comment_text =
            r.reply_comment_data.comment_text;
        } else {
          let commenterInfo: CommenterInfo = {
            full_name: { last_name: "", first_name: "" },
            uid: "",
            rule: "",
            profile_photo: "",
            status: "",
            isDesigner: false,
          };
          userCollection
            .doc(r.reply_comment_data.commenter_uid)
            .get()
            .pipe(first())
            .subscribe((userQuery) => {
              let data = userQuery.data();

              commenterInfo.full_name = {
                first_name: data?.full_name?.first_name,
                last_name: data?.full_name?.last_name,
              };
              commenterInfo.profile_photo = data?.profile_photo;
              commenterInfo.rule = data?.rule;
              commenterInfo.status = data?.status;
              commenterInfo.uid = userQuery.id;
              commenterInfo.isDesigner = data?.rule === "designer";
            });
          let replyComment: ReplyComment = {
            reply_comment_data: r.reply_comment_data,
            id: r.id,
            commenter_info: commenterInfo,
          };
          replyComments.push(replyComment);
        }
      });
    });
  // this.replySubs.push(replySub);
  return replyComments;
};

export const generatePassword = (passwordLength: number) => {
  var numberChars = "0123456789";
  var upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var lowerChars = "abcdefghijklmnopqrstuvwxyz";
  var allChars = numberChars + upperChars + lowerChars;
  var randPasswordArray = Array(passwordLength);
  randPasswordArray[0] = numberChars;
  randPasswordArray[1] = upperChars;
  randPasswordArray[2] = lowerChars;
  randPasswordArray = randPasswordArray.fill(allChars, 3);
  return shuffleArray(
    randPasswordArray.map((x) => {
      return x[Math.floor(Math.random() * x.length)];
    })
  ).join("");
};

const shuffleArray = (array: any) => {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};
