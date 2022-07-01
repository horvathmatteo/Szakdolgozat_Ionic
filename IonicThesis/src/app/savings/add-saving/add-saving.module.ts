import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddSavingPageRoutingModule } from './add-saving-routing.module';

import { AddSavingPage } from './add-saving.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddSavingPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [AddSavingPage]
})
export class AddSavingPageModule {}
