import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CategoriesPage } from './categories.page';

const routes: Routes = [
  {
    path: '',
    component: CategoriesPage
  },
  {
    path: 'add-category',
    loadChildren: () => import('./add-category/add-category.module').then( m => m.AddCategoryPageModule)
  },
  {
    path: 'category-transactions',
    loadChildren: () => import('./category-transactions/category-transactions.module').then( m => m.CategoryTransactionsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoriesPageRoutingModule {}
