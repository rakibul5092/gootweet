import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { ChatService } from "src/app/chat/chat-designer/chat.service";
import { ChatsService } from "src/app/chats/chats.service";
import { WallpostButtons } from "src/app/enums/enums";
import { SendMessageService } from "src/app/home-main/manufacturer/profile-test/send-message.service";
import { Product } from "src/app/models/product";
import { User } from "src/app/models/user";
import { SwiperOptions } from "swiper";
import { SwiperComponent } from "swiper/angular";

@Component({
  selector: "app-products-slider",
  templateUrl: "./products-slider.component.html",
  styleUrls: ["./products-slider.component.scss"],
})
export class ProductsSliderComponent implements OnInit, AfterViewInit {
  @ViewChild("swiper", { static: false }) swiper?: SwiperComponent;
  @Input() products: Product[];
  @Input() buttonText: string = "";
  @Input() me: User;
  @Input() owner: User;
  @Output() onProductClick = new EventEmitter();
  buttons = WallpostButtons;

  config: SwiperOptions = {
    spaceBetween: 8,
    width: 228,
  };
  constructor(
    private cdr: ChangeDetectorRef,
    private sendMessage: SendMessageService,
    private designerChat: ChatService,
    private normalChat: ChatsService
  ) {}
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.cdr.detectChanges();
    }, 3000);
  }

  nextSlide() {
    this.swiper.swiperRef.slideNext();
  }
  prevSlide() {
    this.swiper.swiperRef.slidePrev();
  }
  ngOnInit() {}

  onComplete() {
    console.log("Gif finished");
  }

  async sendToMessenger(product: Product) {
    if (product) {
      if (this.me.rule === "designer") {
        this.designerChat.selectedProduct = {
          data: product,
          id: product.id,
          owner: this.owner,
        };
      } else {
        this.normalChat.selectedProduct = {
          data: product,
          id: product.id,
          owner: this.owner,
        };
      }
      this.sendMessage.sendMessage(this.me, this.owner);
    }
  }
  public openProduct(clickedProduct: number) {
    this.onProductClick.emit(clickedProduct);
  }
}
