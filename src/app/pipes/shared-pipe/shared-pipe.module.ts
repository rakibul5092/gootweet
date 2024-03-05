import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {DateAgoPipe} from "../date-ago.pipe";
import {GetGoodLengthPipe} from "../get-good-length.pipe";

@NgModule({
  declarations: [
    DateAgoPipe,
    GetGoodLengthPipe
  ],
  imports: [CommonModule],
  exports: [
    DateAgoPipe,
    GetGoodLengthPipe
  ],
})
export class SharedPipeModule {}
