import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SavingsPage } from './savings.page';

const routes: Routes = [
  {
    path: '',
    component: SavingsPage
  },
  {
    path: 'add-saving',
    loadChildren: () => import('./add-saving/add-saving.module').then( m => m.AddSavingPageModule)
  },
  {
    path: 'modal',
    loadChildren: () => import('./modal/modal.module').then( m => m.ModalPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SavingsPageRoutingModule {}
