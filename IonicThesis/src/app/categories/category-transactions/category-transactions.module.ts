import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CategoryTransactionsPageRoutingModule } from './category-transactions-routing.module';

import { CategoryTransactionsPage } from './category-transactions.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CategoryTransactionsPageRoutingModule
  ],
  declarations: [CategoryTransactionsPage]
})
export class CategoryTransactionsPageModule {}
