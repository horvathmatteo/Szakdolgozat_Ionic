import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailedBalancePageRoutingModule } from './detailed-balance-routing.module';

import { DetailedBalancePage } from './detailed-balance.page';
import { ShowTransactionComponent } from './show-transaction/show-transaction.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailedBalancePageRoutingModule
  ],
  declarations: [DetailedBalancePage, ShowTransactionComponent]
})
export class DetailedBalancePageModule {}
