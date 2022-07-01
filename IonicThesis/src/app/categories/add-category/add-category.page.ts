import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { CategoryService } from 'src/app/services/category/category.service';
import Swiper, { SwiperOptions, Pagination } from 'swiper';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.page.html',
  styleUrls: ['./add-category.page.scss'],
})
export class AddCategoryPage implements OnInit {

  categoryStrings = ["airplane-outline", "alarm-outline", "bandage-outline", "basketball-outline", "bed-outline", "bicycle-outline", "boat-outline", "book-outline", "brush-outline", "build-outline", "cafe-outline", "call-outline", "car-outline", "camera-outline", "cut-outline", "desktop-outline", "dice-outline", "earth-outline", "fish-outline", "fitness-outline", "flask-outline", "ice-cream-outline", "key-outline", "musical-notes-outline", "restaurant-outline", "ticket-outline"];
  categoryForm: FormGroup;
  public swiperConfig: SwiperOptions = {
    pagination: true,
  };
  iconStr: string;
  color: string;

  constructor(private categoryService: CategoryService, private alertController: AlertController) { 

  }

  ngOnInit() {
    this.categoryForm = new FormGroup({
      categoryType: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required])
    });
    Swiper.use([Pagination]);
  }

  setIcon(category: string) {
    this.iconStr = category;
  }

  async createNewCategory() {
    if(this.categoryForm.controls.categoryType.value == "expenses" && this.color && this.iconStr) {
      this.categoryService.createExpenseCategory(this.categoryForm.controls.name.value, this.iconStr, this.color)
    } else if(this.categoryForm.controls.categoryType.value == "incomes" && this.color && this.iconStr) {
      this.categoryService.createIncomeCategory(this.categoryForm.controls.name.value, this.iconStr, this.color)
    } else if(this.iconStr == undefined) {
      const alert = await this.alertController.create({
        header: 'Hiba',
        message: 'Kérlek válassz ikont a kategóriához',
        buttons: ['Rendben'],
      });
      await alert.present();
    } else if (this.color == undefined) {
      const alert = await this.alertController.create({
        header: 'Hiba',
        message: 'Kérlek válassz színt a kategóriához',
        buttons: ['Rendben'],
      });
      await alert.present();
    }
    
  }

}
