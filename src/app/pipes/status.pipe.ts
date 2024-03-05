import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "status",
  pure: true,
})
export class StatusPipe implements PipeTransform {
  transform(role: string, status: string): string {
    if (status && status != "") {
      return status.length > 22 ? status.substring(0, 22) : status;
    }
    if (role === "") {
      role = "user";
    }
    return role == "user"
      ? "Dalyvis"
      : role == "designer"
      ? "Dizaineris"
      : role == "manufacturer"
      ? "Gamintojas"
      : "Distrubutorius";
  }
}
