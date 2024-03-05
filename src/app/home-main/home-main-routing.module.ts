import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeMainPage } from "./home-main.page";

const routes: Routes = [
  {
    path: "",
    component: HomeMainPage,
  },
  {
    path: "add-post",
    loadChildren: () =>
      import("./advertisement-two/advertisement-two.module").then(
        (m) => m.AdvertisementTwoPageModule
      ),
    data: { name: "advertisement-two" },
  },
  {
    path: "profile",
    loadChildren: () =>
      import("./manufacturer/manufacturer.module").then(
        (m) => m.ManufacturerPageModule
      ),
    data: { name: "seller" },
  },

  {
    path: "send-to-user-messenger",
    loadChildren: () =>
      import("./../chat/send-user-messenger/send-user-messenger.module").then(
        (m) => m.SendUserMessengerPageModule
      ),
    data: { name: "send-to-user-messenger" },
  },
  {
    path: "send-to-designer-messenger",
    loadChildren: () =>
      import(
        "./../chat/send-designer-messenger/send-designer-messenger.module"
      ).then((m) => m.SendDesignerMessengerPageModule),
    data: { name: "send-to-designer-messenger" },
  },
  {
    path: "designer",
    loadChildren: () =>
      import("./../home-designer/home-designer.module").then(
        (m) => m.HomeDesignerPageModule
      ),
    data: { name: "designer" },
  },

  {
    path: "chats",
    loadChildren: () =>
      import("./../chats/chats.module").then((m) => m.ChatsPageModule),
    data: {
      name: "chats",
    },
  },

  {
    path: "insert",
    loadChildren: () =>
      import(
        "./manufacturer/products/product-information/product-information.module"
      ).then((m) => m.ProductInformationPageModule),
    data: { name: "insert" },
  },
  {
    path: "materials-add",
    loadChildren: () =>
      import(
        "../home-main/manufacturer/materials/materials-add/materials-add.module"
      ).then((m) => m.MaterialsAddPageModule),
    data: { name: "materials-add" },
  },

  {
    path: "purse",
    loadChildren: () =>
      import("./purse/purse.module").then((m) => m.PursePageModule),
    data: { name: "purse" },
  },
  {
    path: "purse-replenishment",
    loadChildren: () =>
      import("./purse-replenishment/purse-replenishment.module").then(
        (m) => m.PurseReplenishmentPageModule
      ),
    data: { name: "purse-replenishment" },
  },
  {
    path: "register-details",
    loadChildren: () =>
      import("./register-details/register-details.module").then(
        (m) => m.RegisterFourPageModule
      ),
    data: { name: "register-details" },
  },
  {
    path: "register-category",
    loadChildren: () =>
      import("./register-category/register-category.module").then(
        (m) => m.RegisterCategoryPageModule
      ),
    data: { name: "register-category" },
  },

  {
    path: "tracking-manufacturers",
    loadChildren: () =>
      import("./tracking-manufacturers/tracking-manufacturers.module").then(
        (m) => m.TrackingManufacturersPageModule
      ),
    data: { name: "tracking-manufacturers" },
  },

  {
    path: "user-settings",
    loadChildren: () =>
      import("./user-settings/user-settings.module").then(
        (m) => m.UserSettingsPageModule
      ),
    data: { name: "user-settings" },
  },
  {
    path: "mobile-menu",
    loadChildren: () =>
      import("./mobile-menu/mobile-menu.module").then(
        (m) => m.MobileMenuPageModule
      ),
    data: { name: "mobile-menu" },
  },

  {
    path: "search-result",
    loadChildren: () =>
      import("./search-result/search-result.module").then(
        (m) => m.SearchResultPageModule
      ),
    data: { name: "search-result" },
  },

  {
    path: "purchase",
    loadChildren: () =>
      import("./purchase/purchase.module").then((m) => m.PurchasePageModule),
    data: { name: "purchase" },
  },

  {
    path: "manufacturer-order-products",
    loadChildren: () =>
      import(
        "./manufacturer-order-products/manufacturer-order-products.module"
      ).then((m) => m.ManufacturerOrderProductsPageModule),
    data: { name: "manufacturer-order-products" },
  },
  {
    path: "user-mobile-menu",
    loadChildren: () =>
      import("./user-mobile-menu/user-mobile-menu.module").then(
        (m) => m.UserMobileMenuPageModule
      ),
    data: { name: "user-mobile-menu" },
  },
  {
    path: "user-order",
    loadChildren: () =>
      import("./user-order/user-order.module").then(
        (m) => m.UserOrderPageModule
      ),
    data: { name: "user-order" },
  },
  {
    path: "user-order-products",
    loadChildren: () =>
      import("./user-order-products/user-order-products.module").then(
        (m) => m.UserOrderProductsPageModule
      ),
    data: { name: "user-order-products" },
  },

  {
    path: "admin",
    loadChildren: () =>
      import("./admin/admin.module").then((m) => m.AdminPageModule),
    data: { name: "admin" },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeMainPageRoutingModule {}
