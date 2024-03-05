import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "getUnit",
  pure: true,
})
export class GetUnitPipe implements PipeTransform {
  transform(good: any): any {
    if (Array.isArray(good))
      return good[0]?.unit === "" || !good[0]?.unit ? "" : "/" + good[0]?.unit;
    return good?.unit === "" || !good?.unit ? "" : "/" + good?.unit;
  }
}
