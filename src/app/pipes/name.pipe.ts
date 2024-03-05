import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "join_name",
  pure: true,
})
export class NamePipe implements PipeTransform {
  transform(
    fullName: { first_name: string; last_name: string },
    short?: number
  ): string {
    let name = (fullName?.first_name || "") + " " + (fullName?.last_name || "");
    return (
      (short && name.length > short ? name.substring(0, short) + ".." : name) ||
      ""
    );
  }
}
