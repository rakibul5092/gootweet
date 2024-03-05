import firestore from "firebase/compat/app";
import { AppComponent } from "src/app/app.component";
import { User } from "src/app/models/user";

declare var Viewer: any;

const USER_INFO = "user";

export const getUser = async () => {
  if (!AppComponent.isBrowser.value) {
    return null;
  }
  let user: User = JSON.parse(localStorage.getItem(USER_INFO));
  if (user && user.emailVerified) {
    return user;
  } else {
    return null;
  }
};

let gallery: any;
export const openPhotoFromArray = (id) => {
  let image = document.getElementById(id);

  image.addEventListener("hidden", () => {
    if (gallery) {
      gallery.destroy();
    }
  });
  gallery = new Viewer(image);
  gallery.show();
};

export const openPhoto = (id: string, i = 0) => {
  let image = document.getElementById(id);
  image.addEventListener("hidden", () => {
    if (gallery) {
      gallery.destroy();
    }
  });
  gallery = new Viewer(image, {
    initialViewIndex: i,
    filter(image) {
      console.log(image);

      return image.id !== "icon";
    },
  });
  gallery.show();
};

export const getTimestamp = () => {
  return firestore.firestore.FieldValue.serverTimestamp();
};

export const getFirestoreIncrement = () => {
  return firestore.firestore.FieldValue.increment(1);
};
export const getFirestoreDecrement = () => {
  return firestore.firestore.FieldValue.increment(-1);
};

const cipher = (salt) => {
  const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
  const byteHex = (n) => ("0" + Number(n).toString(16)).substr(-2);
  const applySaltToChar = (code) =>
    textToChars(salt).reduce((a, b) => a ^ b, code);

  return (text) =>
    text.split("").map(textToChars).map(applySaltToChar).map(byteHex).join("");
};

const decipher = (salt) => {
  const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
  const applySaltToChar = (code) =>
    textToChars(salt).reduce((a, b) => a ^ b, code);
  return (encoded) =>
    encoded
      .match(/.{1,2}/g)
      .map((hex) => parseInt(hex, 16))
      .map(applySaltToChar)
      .map((charCode) => String.fromCharCode(charCode))
      .join("");
};

export const makeName = (mimeType: string, uid: any): string => {
  const timestamp = Number(new Date());
  return uid + "_post_file_" + timestamp + "." + mimeType;
};

export const captureThumb = (
  videoPlayer: HTMLVideoElement
): HTMLCanvasElement => {
  const canvas = document.createElement("canvas");
  canvas.width = videoPlayer.videoWidth;
  canvas.height = videoPlayer.videoHeight;

  canvas
    .getContext("2d")
    .drawImage(
      videoPlayer,
      0,
      0,
      videoPlayer.videoWidth,
      videoPlayer.videoHeight
    );
  return canvas;
};
