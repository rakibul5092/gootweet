import { isPlatformServer } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, Inject, OnInit, PLATFORM_ID } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { ActivatedRoute } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { first, map } from "rxjs/operators";
import { users, wallpost } from "../constants";
import { User } from "../models/user";
import { WallPost, WallPostData } from "../models/wall-test";
import { convertTime } from "../services/functions/pipe-functions";
import { LoginService } from "../services/login.service";
import { SeoService } from "../services/seo.service";

@Component({
  selector: "app-single-post",
  templateUrl: "./single-post.page.html",
  styleUrls: ["./single-post.page.scss"],
})
export class SinglePostPage implements OnInit {
  me: User;
  wallPost: WallPost;
  isLoggedin: BehaviorSubject<boolean> = new BehaviorSubject(false);

  redirectWithComment: boolean = false;
  redirectWithReaction: boolean = false;
  wallPostNotFound = 0;
  constructor(
    private storage: LoginService,
    private activatedRoute: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: any,
    private firestore: AngularFirestore,
    private http: HttpClient,
    private seoService: SeoService
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParams.pipe(first()).subscribe(async (params) => {
      if (params && params.id) {
        const user = await this.storage.getUser();
        if (user) {
          this.me = user;
          this.isLoggedin.next(true);
        }
        const wallId = params.id;
        if (isPlatformServer(this.platformId)) {
          this.http
            .get(
              "https://europe-west2-furniin-d393f.cloudfunctions.net/wallpost_seo_data?wall_id=" +
                wallId
            )
            .pipe(first())
            .subscribe((query: any) => {
              if (query && query.status) {
                const wallPostData: WallPostData = query.data as WallPostData;
                if (wallPostData.products && wallPostData.products.length > 0) {
                  this.seoService.init(
                    wallPostData.title,
                    wallPostData.description,
                    wallPostData.products[0].main_images[0],
                    "product"
                  );
                } else {
                  // this.seoService.init(
                  //   wallPostData.title,
                  //   wallPostData.description,
                  //   wallPostData.files
                  //     ? wallPostData.coverImage
                  //     : wallPostData.images[0],
                  //   "cover"
                  // );
                }
              }
            });
        } else {
          if (params.redirection) {
            this.redirectWithComment = params.redirection == "comment";
            this.getWallPosts(user, wallId).subscribe((data) => {
              if (data !== undefined) {
                this.wallPostNotFound = data ? 1 : 2;
                if (data !== null) {
                  this.wallPost = data;
                  setTimeout(() => {
                    if (this.redirectWithComment) {
                      if (params.comment_id) {
                        const doc = document.getElementById(params.comment_id);
                        doc.style.backgroundColor = "#f1e9d0";
                        doc.scrollIntoView({
                          behavior: "smooth",
                        });
                        setTimeout(() => {
                          doc.style.backgroundColor = "#f5f5f6";
                        }, 4500);
                      }
                    }
                  }, 3000);
                }
              }
            });
          } else if (!params.redirection) {
            this.getWallPosts(user, wallId).subscribe((data) => {
              if (data !== undefined) {
                this.wallPostNotFound = data ? 1 : 2;
                if (data !== null) {
                  this.wallPost = data;
                }
              }
            });
          }
        }
      }
    });
  }

  getWallPosts(user: User, wallId: string) {
    let collection = this.firestore.collection(wallpost).doc(wallId);
    return collection.get().pipe(
      first(),
      map((actions) => {
        let data: WallPostData = actions.data() as WallPostData;
        let id = actions.id;
        data.convertedTime = convertTime(data.timestamp);
        let wallPost: WallPost = {
          data: data,
          id: id,
          myUid: user?.uid,
          shortened: true,
          comments: null,
          isCommentAll: false,
          commentText: "",
          commentForEdit: null,
          whoTyping: null,
          collection: this.firestore.collection(wallpost),
          userCollection: this.firestore.collection(users),
        };
        return wallPost;
      })
    );
  }
}
