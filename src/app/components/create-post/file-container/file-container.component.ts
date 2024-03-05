import { Component, Input, OnInit } from "@angular/core";
import { ItemReorderEventDetail } from "@ionic/angular";
import { WallPostData } from "src/app/models/wall-test";

@Component({
  selector: "app-file-container",
  templateUrl: "./file-container.component.html",
  styleUrls: ["./file-container.component.scss"],
})
export class FileContainerComponent implements OnInit {
  @Input() fileData: any[];
  @Input() wallPost: WallPostData;
  isReordered = false;
  layouts = [
    {
      icon: "assets/img/layout/layout_3_styled_grid.svg",
      type: 1,
    },
    {
      icon: "assets/img/layout/layout_4_grid.svg",
      type: 2,
    },
    {
      icon: "assets/img/layout/layout_4_styled_grid.svg",
      type: 3,
    },
    {
      icon: "assets/img/layout/layout_5_grid.svg",
      type: 4,
    },
    {
      icon: "assets/img/layout/layout_5_styled_grid.svg",
      type: 5,
    },
  ];
  constructor() {}

  ngOnInit() {}

  async doReorder(event: CustomEvent<ItemReorderEventDetail>) {
    let from = event?.detail.from;
    let to = event?.detail.to;
    let temp = this.wallPost.files[from];
    this.wallPost.files[from] = this.wallPost.files[to];
    this.wallPost.files[to] = temp;
    this.fileData = event.detail.complete(this.fileData);
    this.isReordered = true;
  }

  removeImage(index: number) {
    this.wallPost.files.splice(index, 1);
    this.fileData.splice(index, 1);
  }

  onLayoutClick(type: number) {
    this.wallPost.layout = type;
  }
}
