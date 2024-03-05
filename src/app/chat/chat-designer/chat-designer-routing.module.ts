import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChatDesignerPage } from './chat-designer.page';

const routes: Routes = [
  {
    path: '',
    component: ChatDesignerPage
  },  {
    path: 'single-chat',
    loadChildren: () => import('./single-chat/single-chat.module').then( m => m.SingleChatPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatDesignerPageRoutingModule {}
