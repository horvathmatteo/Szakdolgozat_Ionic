import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Category } from '../models/category';
import { CategoryService } from '../services/category/category.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {
  categories: Category[] = [];
  color: string;

  constructor(private categoryService: CategoryService, private router: Router) {
    this.categoryService.getExpenseCategories().subscribe((res) => {
      res.map((value) => {
        this.categories.push({
          id: value.payload.doc.id,
          ...value.payload.doc.data()
        });
      });
    });
    this.categoryService.getIncomeCategories().subscribe((res) => {
      res.map((value) => {
        this.categories.push({
          id: value.payload.doc.id,
          ...value.payload.doc.data()
        });
      });
    });
  }

  ngOnInit() {
  }

  showCategoryTransactions(category: any) {
    let navigationExtras: NavigationExtras = { state: { category: category } };
    this.router.navigate(['categories/category-transactions'], navigationExtras);
  }

}
