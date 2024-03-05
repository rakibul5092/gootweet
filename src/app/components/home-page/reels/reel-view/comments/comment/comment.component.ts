import { Component, Input, OnInit } from "@angular/core";
import { ReelComment } from "src/app/models/reels.model";

@Component({
  selector: "app-comment",
  templateUrl: "./comment.component.html",
  styleUrls: ["./comment.component.scss"],
})
export class CommentComponent implements OnInit {
  @Input() comment: ReelComment;
  constructor() {}

  ngOnInit() {}
}
