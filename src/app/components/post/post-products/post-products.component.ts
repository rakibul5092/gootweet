import { Component, Input, OnInit } from "@angular/core";
import { wall_post_image_base, wall_post_video_base } from "src/app/constants";
import { openPhoto } from "src/app/services/functions/functions";
import { OpenSingleProductService } from "src/app/services/open-single-product.service";
import { Product, ProductForChat } from "../../../models/product";
import { User } from "../../../models/user";
import { WallPost } from "../../../models/wall-test";
declare var Viewer: any;
@Component({
  selector: "app-post-products",
  templateUrl: "./post-products.component.html",
  styleUrls: ["./post-products.component.scss"],
})
export class PostProductsComponent implements OnInit {
  @Input() wallPost: WallPost;
  @Input() me: User;
  length: number = 0;
  default = "./assets/loading.svg";
  wall_post_image_base = wall_post_image_base;
  wall_post_video_base = wall_post_video_base;

  openPhoto = openPhoto;
  constructor(private openSingleProductService: OpenSingleProductService) {}

  ngOnInit() {
    this.length = this.wallPost?.data?.products?.length;
  }
  isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement?.clientWidth)
    );
  }
  onScroll() {
    // let videoPlayer: any = document.getElementById("player");
    // if (videoPlayer) {
    //   setTimeout(() => {
    //     if (this.isInViewport(videoPlayer)) {
    //       videoPlayer.play();
    //     } else {
    //       videoPlayer.pause();
    //     }
    //     console.log("Found player:", this.isInViewport(videoPlayer));
    //   }, 1000);
    // }
  }

  drag(event: any, product: Product, owner: User) {
    let p: ProductForChat = {
      data: product,
      id: product.id,
      owner: owner,
    };
    event.dataTransfer.setData("product", JSON.stringify(p));
  }

  openProduct(post: WallPost, event: any) {
    this.openSingleProductService.openSingleProduct(
      post.data.products[event],
      post.data.owner
    );
  }
}
