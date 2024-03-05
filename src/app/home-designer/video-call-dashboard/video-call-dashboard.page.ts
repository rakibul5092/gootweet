import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import AgoraRTC from "agora-rtc-sdk-ng";
import { BehaviorSubject } from "rxjs";
import { ChatService } from "src/app/chat/chat-designer/chat.service";
import { ChatsService } from "src/app/chats/chats.service";
import { CallService } from "src/app/components/calls/call.service";
import { ROLES } from "src/app/constants";
import { IncomingCall } from "src/app/models/call.model";
import { User } from "src/app/models/user";
import { AgoraManager } from "src/app/services/functions/agora.manager";
import { LoginService } from "src/app/services/login.service";

@Component({
  selector: "app-video-call-dashboard",
  templateUrl: "./video-call-dashboard.page.html",
  styleUrls: ["./video-call-dashboard.page.scss"],
})
export class VideoCallDashboardPage implements OnInit, OnDestroy {
  @Input() private callData: IncomingCall;
  public me: User;
  public cams: MediaDeviceInfo[] = [];
  public mic = true;
  public videoCam = true;
  public time$: BehaviorSubject<string> = new BehaviorSubject("00:00");
  private localPlayerContainer: HTMLDivElement;
  private remotePlayerContainer: HTMLDivElement;
  private agoraManger: AgoraManager;
  private isChangedVideoPosition = false;
  private isDragging = false;
  private offsetX: number;
  private offsetY: number;
  constructor(
    private storageService: LoginService,
    private callService: CallService,
    private chatsService: ChatsService,
    private chatService: ChatService
  ) {}
  ngOnDestroy(): void {
    this.agoraManger?.leave();
    console.log("destroyed");
  }
  ionViewWillLeave() {
    this.agoraManger?.leave();
    console.log("Left");
  }

  public hangupCall() {
    this.agoraManger?.leave();
    if (this.me.rule === ROLES.DESIGNER) {
      this.chatService.callData$.next(null);
    } else {
      this.chatsService.callData$.next(null);
    }
  }

  async ngOnInit() {
    this.me = await this.storageService.getUser();
    this.cams = await AgoraRTC.getCameras();
    this.time$ = this.callService.startTimer();
    if (this.callData && this.me) {
      this.localPlayerContainer = document.getElementById(
        "local-player"
      ) as HTMLDivElement;
      this.remotePlayerContainer = document.getElementById(
        "remote-player"
      ) as HTMLDivElement;
      this.remotePlayerContainer.style.transform = "rotateY(180deg);";
      // this.callData = await this.callService.getCallInfo(this.callData.id);
      // this.initMouseUpDown(this.localPlayerContainer);
      // this.initMouseMove(this.localPlayerContainer, this.remotePlayerContainer);
      this.initAgora();
    }
  }

  public switchVideoPosition(flag: number) {
    if (
      this.localPlayerContainer &&
      this.remotePlayerContainer &&
      ((this.isChangedVideoPosition && flag === 2) ||
        (!this.isChangedVideoPosition && flag === 1))
    ) {
      this.isChangedVideoPosition = !this.isChangedVideoPosition;
      const localClass = this.localPlayerContainer.classList.value;
      const remoteClass = this.remotePlayerContainer.classList.value;
      this.localPlayerContainer.className = remoteClass;
      this.remotePlayerContainer.className = localClass;
      if (!this.isChangedVideoPosition) {
        this.remotePlayerContainer.removeAllListeners();
        // this.initMouseUpDown(this.localPlayerContainer);
        // this.initMouseMove(
        //   this.localPlayerContainer,
        //   this.remotePlayerContainer
        // );
      } else {
        this.localPlayerContainer.removeAllListeners();
        // this.initMouseUpDown(this.remotePlayerContainer);
        // this.initMouseMove(
        //   this.remotePlayerContainer,
        //   this.localPlayerContainer
        // );
      }
    }
  }

  public async switchCamera() {
    await this.agoraManger?.switchCamera(this.cams);
  }
  public micOnOff() {
    this.mic = !this.mic;
    this.agoraManger?.setMuted(this.mic);
  }
  public camOnOff() {
    this.videoCam = !this.videoCam;
    this.agoraManger?.videoVisible(this.videoCam);
  }

  // private initMouseUpDown(element: HTMLDivElement) {
  //   element.addEventListener("mousedown", (e) => {
  //     console.log("mousedown");

  //     this.isDragging = true;
  //     // Calculate the offset of mouse pointer to the draggable element
  //     this.offsetX = e.offsetX;
  //     this.offsetY = e.offsetY;
  //   });
  //   element.addEventListener("mouseup", () => {
  //     console.log("mouseup");
  //     this.isDragging = false;
  //   });
  // }
  // private initMouseMove(child: HTMLDivElement, parent: HTMLDivElement) {
  //   document.addEventListener("mousemove", (e) => {
  //     console.log("mousemove");

  //     if (this.isDragging) {
  //       // Calculate the new position of the draggable element
  //       let x = e.clientX - this.offsetX - parent.offsetLeft;
  //       let y = e.clientY - this.offsetY - parent.offsetTop;

  //       // Ensure the draggable element stays within the boundaries of its parent
  //       x = Math.max(0, Math.min(x, parent.clientWidth - child.offsetWidth));
  //       y = Math.max(0, Math.min(y, parent.clientHeight - child.offsetHeight));

  //       // Update the position of the draggable element
  //       child.style.left = x + "px";
  //       child.style.top = y + "px";
  //     }
  //   });
  // }
  private initAgora() {
    if (this.localPlayerContainer && this.remotePlayerContainer) {
      this.agoraManger = new AgoraManager(
        this.localPlayerContainer,
        this.remotePlayerContainer,
        this.me.uid,
        "channel_" + this.callData.id
      );
      this.agoraManger.join();
      this.agoraManger.getAgoraEngine().on("user-left", () => {
        this.hangupCall();
      });
    }
  }
}
