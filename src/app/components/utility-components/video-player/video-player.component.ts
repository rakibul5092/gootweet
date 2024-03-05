import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from "@angular/core";

@Component({
  selector: "app-video-player",
  templateUrl: "./video-player.component.html",
  styleUrls: ["./video-player.component.scss"],
})
export class VideoPlayerComponent implements AfterViewInit {
  @ViewChild("videoPlayer", { static: false })
  videoPlayer: ElementRef<HTMLVideoElement>;
  @Input() url: string;
  @Input() controls = true;
  @Input() autoplay = false;
  @Input() loop = false;
  @Output() onEnd = new EventEmitter(false);
  public height = 0;
  public width = 0;
  constructor() {}
  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.videoPlayer) {
        const container = document.getElementById(
          "live-player-container"
        ) as HTMLDivElement;
        console.log(this.videoPlayer, container.getBoundingClientRect().height);
        this.videoPlayer.nativeElement.style.width = "100%";
        this.videoPlayer.nativeElement.style.height =
          container.getBoundingClientRect().height + "px";
        // this.videoPlayer.nativeElement.onloadeddata = (ev) => {
        //   console.log(this.videoPlayer.nativeElement, ev);
        //   const target = ev.target as any;
        //   if (
        //     this.videoPlayer.nativeElement.clientHeight > target.clientWidth
        //   ) {
        //     this.videoPlayer.nativeElement.style.height = "100%";
        //     this.videoPlayer.nativeElement.style.width =
        //       (target.clientWidth * 100) / target.clientHeight + "%";
        //   } else {
        //     this.videoPlayer.nativeElement.style.width = "100%";
        //     this.videoPlayer.nativeElement.style.height =
        //       (target.clientHeight * 100) / target.clientWidth + "%";
        //   }
        // };
      } else {
        console.log("player not found");
      }
    }, 1000);
  }

  ended() {
    this.onEnd.emit(true);
  }
}
