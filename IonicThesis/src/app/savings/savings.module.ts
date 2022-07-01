import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SavingsPageRoutingModule } from './savings-routing.module';

import { SavingsPage } from './savings.page';
import { ModalPage } from './modal/modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SavingsPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [SavingsPage, ModalPage]
})
export class SavingsPageModule {}
