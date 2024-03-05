import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "dateAgo",
  pure: true,
})
export class DateAgoPipe implements PipeTransform {
  transform(time: any, args?: any): any {
    if (time) {
      try {
        if (!time) {
          return "";
        } else if (time instanceof String) {
          time = new Date(time.toString());
        }
        const presentTime = new Date();
        let commentTime = new Date(time?.toDate());
        // return time ? time.toDate() : "";
        var delta =
          Math.abs(presentTime.getTime() - commentTime.getTime()) / 1000;
        // calculate (and subtract) whole days
        var days = Math.floor(delta / 86400);
        delta -= days * 86400;
        if (days != 0) {
          return days + "d";
        }
        // calculate (and subtract) whole hours
        var hours = Math.floor(delta / 3600) % 24;
        delta -= hours * 3600;
        if (hours != 0) {
          return hours + "h";
        }
        // calculate (and subtract) whole minutes
        var minutes = Math.floor(delta / 60) % 60;
        delta -= minutes * 60;
        if (minutes != 0) {
          return minutes + "m";
        }
        // what's left is seconds
        var seconds = Math.floor(delta % 60);
        if (seconds != 0) {
          return seconds + "s";
        }
      } catch (er) {}
    } else {
      return "";
    }
  }
}
