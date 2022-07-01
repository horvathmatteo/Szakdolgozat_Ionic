import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddSavingPage } from './add-saving.page';

const routes: Routes = [
  {
    path: '',
    component: AddSavingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddSavingPageRoutingModule {}
