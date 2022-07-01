import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailedBalancePage } from './detailed-balance.page';

const routes: Routes = [
  {
    path: '',
    component: DetailedBalancePage
  },
  {
    path: 'add-transaction',
    loadChildren: () => import('./add-transaction/add-transaction.module').then( m => m.AddTransactionPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailedBalancePageRoutingModule {}
