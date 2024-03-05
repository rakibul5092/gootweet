import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "designer-register-details",
    loadChildren: () =>
      import(
        "./designer-register-details/designer-register-details.module"
      ).then((m) => m.DesignerRegisterDetailsPageModule),
    data: { name: "designer-register-details" },
  },
  {
    path: "designer-wallet",
    loadChildren: () =>
      import("./designer-wallet/designer-wallet.module").then(
        (m) => m.DesignerWalletPageModule
      ),
    data: { name: "designer-wallet" },
  },
  {
    path: "designer-my-manufacturer-catalog-one",
    loadChildren: () =>
      import(
        "./designer-my-manufacturer-catalog-one/designer-my-manufacturer-catalog-one.module"
      ).then((m) => m.DesignerMyManufacturerCatalogOnePageModule),
    data: { name: "designer-my-manufacturer-catalog-one" },
  },
  {
    path: "designer-sending-request",
    loadChildren: () =>
      import("./designer-sending-request/designer-sending-request.module").then(
        (m) => m.DesignerSendingRequestPageModule
      ),
    data: { name: "designer-sending-request" },
  },
  {
    path: "designer-general-settings",
    loadChildren: () =>
      import(
        "./designer-general-settings/designer-general-settings.module"
      ).then((m) => m.DesignerGeneralSettingsPageModule),
    data: { name: "designer-general-settings" },
  },

  {
    path: "designer-manufacturer-alphabetically",
    loadChildren: () =>
      import(
        "./designer-manufacturer-alphabetically/designer-manufacturer-alphabetically.module"
      ).then((m) => m.DesignerManufacturerAlphabeticallyPageModule),
    data: { name: "designer-manufacturer-alphabetically" },
  },

  {
    path: "designer-request",
    loadChildren: () =>
      import("./designer-request/designer-request.module").then(
        (m) => m.DesignerRequestPageModule
      ),
    data: { name: "designer-request" },
  },

  {
    path: "designer-profile-new-project",
    loadChildren: () =>
      import(
        "./designer-profile-new-project/designer-profile-new-project.module"
      ).then((m) => m.DesignerProfileNewProjectPageModule),
    data: { name: "designer-profile-new-project" },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeDesignerPageRoutingModule {}
