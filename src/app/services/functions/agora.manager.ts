import AgoraRTC, {
  ClientConfig,
  IAgoraRTCClient,
  ICameraVideoTrack,
  ILocalAudioTrack,
  IRemoteAudioTrack,
  IRemoteVideoTrack,
} from "agora-rtc-sdk-ng";
import { appId } from "src/app/constants";

interface ChannelParams {
  localAudioTrack: ILocalAudioTrack;
  localVideoTrack: ICameraVideoTrack;
  remoteAudioTrack: IRemoteAudioTrack;
  remoteVideoTrack: IRemoteVideoTrack;
}

export class AgoraManager {
  private agoraEngine: IAgoraRTCClient = null;
  private remotePlayer: HTMLDivElement;
  private localPlayer: HTMLDivElement;
  private options = {
    // Pass your App ID here.
    appId: appId,
    // Set the channel name.
    channel: "",
    // Pass your temp token here.
    token: null,
    // Set the user ID.
    uid: "",
    // Set the user role
    role: "",
  };

  public channelParameters: ChannelParams = {
    // A variable to hold a local audio track.
    localAudioTrack: null,
    // A variable to hold a local video track.
    localVideoTrack: null,
    // A variable to hold a remote audio track.
    remoteAudioTrack: null,
    // A variable to hold a remote video track.
    remoteVideoTrack: null,
  };

  constructor(
    localP: any,
    remoteP: any,
    uid: string,
    channelId: string,
    isLive = false
  ) {
    // Set up the signaling engine with the provided App ID, UID, and configuration
    this.localPlayer = localP;
    this.remotePlayer = remoteP;
    this.options.uid = uid;
    this.options.channel = channelId;
    this.setupAgoraEngine(isLive);
  }

  public leave = () => {
    this.agoraEngine?.leave();
    this.channelParameters?.localAudioTrack?.close();
    this.channelParameters?.localVideoTrack?.close();
  };

  public startLive() {
    this.agoraEngine.setClientRole("host");
    this.publishAndPlay();
  }

  public join = async () => {
    this.handleVSDKEvents();
    await this.agoraEngine.join(
      this.options.appId,
      this.options.channel,
      this.options.token,
      this.options.uid
    );
    // Create a local audio track from the audio sampled by a microphone.
    this.publishAndPlay();
  };

  private async publishAndPlay() {
    this.channelParameters.localAudioTrack =
      await AgoraRTC.createMicrophoneAudioTrack();
    // Create a local video track from the video captured by a camera.
    this.channelParameters.localVideoTrack =
      await AgoraRTC.createCameraVideoTrack();
    // Append the local video container to the page body.
    // Publish the local audio and video tracks in the channel.
    await this.agoraEngine.publish([
      this.channelParameters.localAudioTrack,
      this.channelParameters.localVideoTrack,
    ]);
    // Play the local video track.
    this.channelParameters.localVideoTrack.play(this.localPlayer);
  }

  private handleVSDKEvents = () => {
    this.agoraEngine.on("user-published", async (user, mediaType) => {
      await this.agoraEngine.subscribe(user, mediaType);
      if (mediaType == "video") {
        // Retrieve the remote video track.
        this.channelParameters.remoteVideoTrack = user.videoTrack;
        // Retrieve the remote audio track.
        this.channelParameters.remoteAudioTrack = user.audioTrack;

        // Play the remote video track.
        this.channelParameters.remoteVideoTrack.play(this.remotePlayer);
      }
      // Subscribe and play the remote audio track If the remote user publishes the audio track only.
      if (mediaType == "audio") {
        // Get the RemoteAudioTrack object in the AgoraRTCRemoteUser object.
        this.channelParameters.remoteAudioTrack = user.audioTrack;
        // Play the remote audio track. No need to pass any DOM element.
        this.channelParameters.remoteAudioTrack.play();
      }
    });
  };
  public async switchCamera(cams: MediaDeviceInfo[]) {
    if (cams.length > 0) {
      const videoTrackLabel =
        this.channelParameters.localVideoTrack.getTrackLabel();
      const currentCams = cams.filter((cam) => cam.label !== videoTrackLabel);
      if (currentCams && currentCams.length > 0) {
        await this.channelParameters.localVideoTrack.setDevice(
          currentCams[0].deviceId
        );
      }
    }
  }

  public setMuted(flag: boolean) {
    this.channelParameters.localAudioTrack.setEnabled(flag);
  }
  public videoVisible(flag: boolean) {
    this.channelParameters.localVideoTrack.setEnabled(flag);
  }
  public getAgoraEngine = () => {
    return this.agoraEngine;
  };
  private setupAgoraEngine = (isLive: boolean) => {
    const config: ClientConfig = isLive
      ? {
          mode: "live",
          codec: "vp8",
        }
      : {
          mode: "rtc",
          codec: "vp9",
        };
    this.agoraEngine = AgoraRTC.createClient(config);
  };
}
