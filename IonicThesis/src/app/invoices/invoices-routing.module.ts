import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InvoicesPage } from './invoices.page';

const routes: Routes = [
  {
    path: '',
    component: InvoicesPage
  },
  {
    path: 'add-invoice',
    loadChildren: () => import('./add-invoice/add-invoice.module').then( m => m.AddInvoicePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvoicesPageRoutingModule {}
