// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  appUrl: "https://gootweet.com/",
  client_id:
    "629139033631-b7r3gom16mrcsdbu53t4ubo6elcgm5mq.apps.googleusercontent.com",
  firebase: {
    projectId: "furniin-d393f",
    appId: "1:629139033631:web:e326ec2b46a6ccc92c4f2a",
    databaseURL: "https://furniin-d393f.firebaseio.com",
    storageBucket: "furniin-d393f.appspot.com",
    locationId: "europe-west",
    apiKey: "AIzaSyCKU13k-bd-amZUxvNvWdyZUx7CGOb8RrY",
    authDomain: "furniin-d393f.firebaseapp.com",
    messagingSenderId: "629139033631",
    measurementId: "G-RZXM40DEKC",
  },
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyCKU13k-bd-amZUxvNvWdyZUx7CGOb8RrY",
    authDomain: "furniin-d393f.firebaseapp.com",
    databaseURL: "https://furniin-d393f.firebaseio.com",
    projectId: "furniin-d393f",
    storageBucket: "furniin-d393f.appspot.com",
    messagingSenderId: "629139033631",
    appId: "1:629139033631:web:e326ec2b46a6ccc92c4f2a",
    measurementId: "G-RZXM40DEKC",
  },
  algolia: {
    appId: "062ERCCMNR",
    apiKey: "5e505449ecbe511a242237b4ec7ca4ad",
  },
  baseUrl: "http://localhost:8100",
  domain: "localhost",
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
