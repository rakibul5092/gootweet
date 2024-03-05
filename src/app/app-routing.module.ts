import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { SelectiveLoadingStrategy } from "./custom-preload-strategy";

const routes: Routes = [
  {
    path: "reel-view",
    loadChildren: () =>
      import("./components/home-page/reels/reel-view/reel-view.module").then(
        (m) => m.ReelViewModule
      ),
    data: {
      name: "reel-view",
    },
  },
  {
    path: "create-reel-record",
    loadChildren: () =>
      import(
        "./components/home-page/reels/create-reel-record/create-reel-record.module"
      ).then((m) => m.CreateReelRecordPageModule),
    data: {
      name: "create-reel-record",
    },
  },
  {
    path: "categories",
    loadChildren: () =>
      import("./home-main/categories/categories.module").then(
        (m) => m.CategoriesPageModule
      ),
    data: {
      name: "categories",
    },
  },

  {
    path: "payment-success",
    loadChildren: () =>
      import("./paysera/payment-success/payment-success.module").then(
        (m) => m.PaymentSuccessPageModule
      ),
    data: {
      name: "payment-success",
    },
  },
  {
    path: "payment-failed",
    loadChildren: () =>
      import("./paysera/payment-failed/payment-failed.module").then(
        (m) => m.PaymentFailedPageModule
      ),
    data: {
      name: "payment-failed",
    },
  },
  {
    path: "topup-success",
    loadChildren: () =>
      import("./paysera/topup-success/topup-success.module").then(
        (m) => m.TopupSuccessPageModule
      ),
    data: {
      name: "topup-success",
    },
  },
  {
    path: "topup-failed",
    loadChildren: () =>
      import("./paysera/topup-failed/topup-failed.module").then(
        (m) => m.TopupFailedPageModule
      ),
    data: {
      name: "topup-failed",
    },
  },
  {
    path: "terms-conditions",
    loadChildren: () =>
      import("./register/terms-condition/terms-condition.module").then(
        (m) => m.TermsConditionPageModule
      ),
    data: {
      name: "terms-conditions",
    },
  },
  {
    path: "wallpost",
    loadChildren: () =>
      import("./single-post/single-post.module").then(
        (m) => m.SinglePostPageModule
      ),
    data: {
      name: "wallpost",
    },
  },
  {
    path: "loggedin-accounts",
    loadChildren: () =>
      import("./mobile/loggedin-accounts/loggedin-accounts.module").then(
        (m) => m.LoggedinAccountsPageModule
      ),
    data: {
      name: "loggedin-accounts",
    },
  },
  {
    path: "login",
    loadChildren: () =>
      import("./login/login.module").then((m) => m.LoginPageModule),
    data: {
      name: "login",
    },
  },

  {
    path: "notifications-mobile-web",
    loadChildren: () =>
      import(
        "./mobile/notifications-mobile-web/notifications-mobile-web.module"
      ).then((m) => m.NotificationsMobileWebPageModule),
  },
  {
    path: "gootweet-tube",
    loadChildren: () =>
      import("./mobile/gootweet-tube/gootweet-tube.module").then(
        (m) => m.GootweetTubePageModule
      ),
    data: {
      name: "gootweet-tube",
    },
  },
  {
    path: "more-videos",
    loadChildren: () =>
      import("./mobile/more-videos/more-videos.module").then(
        (m) => m.MoreVideosPageModule
      ),
    data: {
      name: "more-videos",
    },
  },
  {
    path: "live-broadcasting",
    loadChildren: () =>
      import("./mobile/live-broadcasting/live-broadcasting.module").then(
        (m) => m.LiveBroadcastingPageModule
      ),
    data: {
      name: "live-broadcasting",
    },
  },
  {
    path: "russian-basket",
    loadChildren: () =>
      import("./mobile/russian-basket/russian-basket.module").then(
        (m) => m.RussianBasketPageModule
      ),
    data: {
      name: "russian-basket",
    },
  },

  {
    path: "product-more-video/:id",
    loadChildren: () =>
      import("./mobile/product-more-video/product-more-video.module").then(
        (m) => m.ProductMoreVideoPageModule
      ),
    data: {
      name: "product-more-video",
    },
  },

  {
    path: "live-chat/:id/:type",
    loadChildren: () =>
      import("./mobile/live-chat/live-chat.module").then(
        (m) => m.LiveChatPageModule
      ),
    data: {
      name: "live-chat",
    },
  },

  {
    path: "create-live/:id/:type",
    loadChildren: () =>
      import("./live/create-live/create-live.module").then(
        (m) => m.CreateLivePageModule
      ),
    data: {
      name: "create-live",
    },
  },
  {
    path: "view-live/:id",
    loadChildren: () =>
      import("./live/view-live/view-live.module").then(
        (m) => m.ViewLivePageModule
      ),
    data: {
      name: "view-live",
    },
  },

  {
    path: "live-products/:id",
    loadChildren: () =>
      import("./mobile/live-products/live-products.module").then(
        (m) => m.LiveProductsPageModule
      ),
    data: {
      name: "live-products",
    },
  },

  {
    path: "order-details-web",
    loadChildren: () =>
      import("./components/order-details-web/order-details-web.module").then(
        (m) => m.OrderDetailsWebPageModule
      ),
    data: {
      name: "order-details-web",
    },
  },
  {
    path: "product-review",
    loadChildren: () =>
      import("./mobile/order-details/order-details.module").then(
        (m) => m.OrderDetailsPageModule
      ),
    data: {
      name: "product-review",
    },
  },
  {
    path: "filter",
    loadChildren: () =>
      import("./mobile/product-filter/product-filter-routing.module").then(
        (m) => m.ProductFilterPageRoutingModule
      ),
  },
  {
    path: "select-payment-method",
    loadChildren: () =>
      import(
        "./mobile/payments/select-payment-method/select-payment-method.module"
      ).then((m) => m.SelectPaymentMethodPageModule),
  },
  {
    path: "further-information",
    loadChildren: () =>
      import(
        "./mobile/payments/further-information/further-information.module"
      ).then((m) => m.FurtherInformationPageModule),
  },
  {
    path: "social-signin",
    loadChildren: () =>
      import("./mobile/social-signin/social-signin.module").then(
        (m) => m.SocialSigninPageModule
      ),
  },
  {
    path: "product-review-old",
    loadChildren: () =>
      import("./mobile/product-review/product-review.module").then(
        (m) => m.ProductReviewPageModule
      ),
  },
  {
    path: "sub-category-filter-popup",
    loadChildren: () =>
      import(
        "./mobile/sub-category-filter-popup/sub-category-filter-popup.module"
      ).then((m) => m.SubCategoryFilterPopupPageModule),
    data: { name: "sub-category-filter-popup" },
  },

  {
    path: "register",
    loadChildren: () =>
      import("./register/register.module").then((m) => m.RegisterPageModule),
    data: { name: "register" },
  },
  {
    path: "all-live-stream",
    loadChildren: () =>
      import("./all-live-stream/all-live-stream.module").then(
        (m) => m.AllLiveStreamPageModule
      ),
    data: { name: "all-live-stream" },
  },
  {
    path: "single-live-stream",
    loadChildren: () =>
      import("./single-live-stream/single-live-stream.module").then(
        (m) => m.SingleLiveStreamPageModule
      ),
    data: {
      name: "single-live-stream",
    },
  },
  {
    path: "product",
    loadChildren: () =>
      import("./product-details/product-details.module").then(
        (m) => m.ProductDetailsPageModule
      ),
    data: {
      name: "product",
    },
  },

  {
    path: "designer-conversations",
    loadChildren: () =>
      import("./chat/chat-designer/chat-designer.module").then(
        (m) => m.ChatDesignerPageModule
      ),
    data: { name: "designer-conversations" },
  },
  {
    path: "chat-normal",
    loadChildren: () =>
      import("./chat/chat-normal/chat-normal.module").then(
        (m) => m.ChatNormalPageModule
      ),
    data: { name: "chatnormal" },
  },
  {
    path: "conversation",
    loadChildren: () =>
      import("./chat-normal-outside/chat-normal-outside.module").then(
        (m) => m.ChatNormalOutsidePageModule
      ),
    data: { name: "conversations" },
  },
  {
    path: "",
    loadChildren: () =>
      import("./home-main/home-main.module").then((m) => m.HomeMainPageModule),
    data: { name: "home" },
  },
  {
    path: "product-filter",
    loadChildren: () =>
      import("./mobile/product-filter/product-filter.module").then(
        (m) => m.ProductFilterPageModule
      ),
    data: { name: "product-filter" },
  },
];

@NgModule({
  providers: [SelectiveLoadingStrategy],
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: SelectiveLoadingStrategy,
      // scrollPositionRestoration: 'enabled',
      // anchorScrolling: 'enabled'
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
