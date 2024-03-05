import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ChatInputComponent } from "./chat-input.component";
import { IonicModule } from "@ionic/angular";
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [ChatInputComponent],
  imports: [CommonModule, FormsModule, IonicModule],
  exports: [ChatInputComponent],
})
export class ChatInputModule {}
