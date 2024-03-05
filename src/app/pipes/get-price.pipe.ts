import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "getPrice",
  pure: true,
})
export class GetPricePipe implements PipeTransform {
  transform(good: any, i = 0) {
    let price = "0";
    if (Array.isArray(good)) {
      price = Number(good[i]?.price || 0).toFixed(1);
    } else {
      price = Number(good?.price || 0).toFixed(1);
    }
    if (price.endsWith(".0")) {
      return price.slice(0, -2); // Remove the decimal and zero if no decimal places are needed
    }
    return price;
  }
}
