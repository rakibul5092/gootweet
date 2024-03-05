import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Meta, Title } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { first } from "rxjs/operators";
import {
  image_base,
  product_image_base,
  wall_post_image_base,
} from "../constants";

@Injectable({
  providedIn: "root",
})
export class SeoService {
  constructor(
    private titleServce: Title,
    private metaService: Meta,
    private http: HttpClient,
    private router: Router
  ) {}
  getImagePipe(image: any) {
    if (image && image !== "") {
      return image.includes("https://") || image.includes("http://")
        ? image
        : product_image_base + image;
    } else {
      return "https://storage.googleapis.com/furniin-d393f.appspot.com/product_photos/lucduI5syaMFOntVOGuPOjSpCx33_product_photo_1617904400096.webp";
    }
  }

  getWallPostCoverPipe(image) {
    if (image && image != "") return wall_post_image_base + image;
    return "https://storage.googleapis.com/furniin-d393f.appspot.com/product_photos/lucduI5syaMFOntVOGuPOjSpCx33_product_photo_1617904400096.webp";
  }
  sanitize(url) {
    if (url && url !== "") {
      if (url.includes("https://")) {
        return url;
      } else {
        // return image_base + url;
        return image_base + url;
      }
    } else {
      return "https://storage.googleapis.com/furniin-d393f.appspot.com/product_photos/lucduI5syaMFOntVOGuPOjSpCx33_product_photo_1617904400096.webp";
    }
  }
  init(title: string, description: string, image: string, type: string) {
    let ogType = "website";
    if (type === "product") {
      ogType = "book";
      image = this.getImagePipe(image);
    } else if (type === "cover") {
      image = this.getWallPostCoverPipe(image);
    } else if (type === "profile") {
      ogType = "profile";
      image = this.sanitize(image);
    }

    this.titleServce.setTitle(title);
    //twitter
    this.metaService.addTags([
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", property: "twitter:title", content: title },
      {
        name: "twitter:description",
        property: "twitter:description",
        content: description,
      },
      { name: "twitter:image", property: "twitter:image", content: image },
    ]);

    // Facebook
    this.metaService.addTags([
      {
        name: "og:url",
        prefix: "og: http://ogp.me/ns#",
        content: this.router.url,
      },
      { name: "og:type", prefix: "og: http://ogp.me/ns#", content: ogType },
      {
        name: "og:description",
        prefix: "og: http://ogp.me/ns#",
        property: "og:description",
        content: description,
      },
      {
        name: "og:title",
        prefix: "og: http://ogp.me/ns#",
        property: "og:title",
        content: title,
      },
      {
        name: "og:image",
        prefix: "og: http://ogp.me/ns#",
        property: "og:image",
        content: image,
      },
      { name: "og:image:width", property: "og:image:width", content: "600" },
      {
        name: "og:image:height",
        property: "og:image:height",
        content: ogType == "profile" ? "600" : "314",
      },
    ]);
  }

  getHomeSeoData() {
    return this.http
      .get(
        "https://europe-west2-furniin-d393f.cloudfunctions.net/home_seo_data"
      )
      .pipe(first());
  }
}
