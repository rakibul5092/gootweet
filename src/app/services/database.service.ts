import { Injectable } from "@angular/core";
import { WallPost } from "../models/wall-test";
import * as CircularJson from "circular-json";
import { RecomandedProduct } from "../models/product";
import { AppComponent } from "../app.component";
const LAST_POSTS = "last_posts";
const LAST_RECOMMENDS = "last_recommends";
@Injectable({
  providedIn: "root",
})
export class DatabaseService {
  constructor() {}

  async saveLastLoadedPosts(data: WallPost[]) {
    let posts = CircularJson.stringify(data);
    if (!AppComponent.isBrowser.value) {
      return;
    }
    localStorage.setItem(LAST_POSTS, posts);
  }

  async getLastLoadedPosts(): Promise<WallPost[]> {
    let wallPosts: WallPost[] = [];
    if (!AppComponent.isBrowser.value) {
      return wallPosts;
    }
    const wallPost = localStorage.getItem(LAST_POSTS);
    wallPosts = JSON.parse(wallPost);
    return wallPosts;
  }

  async saveLastAds(data: RecomandedProduct[]) {
    let recommends = CircularJson.stringify(data);
    if (!AppComponent.isBrowser.value) {
      return;
    }
    localStorage.setItem(LAST_RECOMMENDS, recommends);
  }

  async getLastAds(): Promise<RecomandedProduct[]> {
    let recommends: RecomandedProduct[] = [];
    if (!AppComponent.isBrowser.value) {
      return recommends;
    }
    const p = localStorage.getItem(LAST_RECOMMENDS);
    recommends = JSON.parse(p);
    return recommends;
  }
}
