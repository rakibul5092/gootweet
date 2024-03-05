import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "urlify" })
export class Urlify implements PipeTransform {
  constructor() {}

  transform(text: string) {
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text?.replace(urlRegex, function (url) {
      return '<a href="' + url + '" target="_blank">' + url + "</a>";
    });
  }
}
