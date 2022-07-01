import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ColorPickerModule } from 'ngx-color-picker';
import { SwiperModule } from 'swiper/angular';

import { IonicModule } from '@ionic/angular';

import { AddCategoryPageRoutingModule } from './add-category-routing.module';

import { AddCategoryPage } from './add-category.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddCategoryPageRoutingModule,
    ReactiveFormsModule,
    ColorPickerModule,
    SwiperModule
  ],
  declarations: [AddCategoryPage]
})
export class AddCategoryPageModule {}
