import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CategoryTransactionsPage } from './category-transactions.page';

const routes: Routes = [
  {
    path: '',
    component: CategoryTransactionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoryTransactionsPageRoutingModule {}
