import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Category } from 'src/app/models/category';
import { CategoryService } from 'src/app/services/category/category.service';
import { Transaction } from 'src/app/models/transaction';
import { TransactionService } from 'src/app/services/transaction/transaction.service';
import { IonDatetime, ToastController } from '@ionic/angular';
import { formatDate } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localHungarian from '@angular/common/locales/hu';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { getCurrencySymbol } from '@angular/common';
import { Router } from '@angular/router';
import { BalanceService } from 'src/app/services/balance/balance.service';

@Component({
  selector: 'app-add-transaction',
  templateUrl: './add-transaction.page.html',
  styleUrls: ['./add-transaction.page.scss'],
})
export class AddTransactionPage implements OnInit {
  @ViewChild('#dateTime', { static: true }) datetime: IonDatetime;
  currencies = ["huf", "eur", "usd", "jpy", "gbp", "chf", "aud", "cad", "cny", "bgn", 
        "czk", "dkk", "hrk", "mxn", "nok", "nzd", "pln", "ron", "rsd", "rub", "sek", "try", "uah", "zar"];
  option: string;
  expenses: Transaction[];
  categories: Category[];
  selectedDate = new Date().toISOString();
  transaction: FormGroup;
  symbol: any;

  constructor(private transactionService: TransactionService, private categoryService: CategoryService, private toastController: ToastController, private router: Router, private balanceService: BalanceService) {
    this.getExpCategories();
    registerLocaleData(localHungarian);
    this.selectedDate = formatDate(this.selectedDate, 'y. MMMM d.', 'hu-HU');
   }

  ngOnInit() {
    this.transaction = new FormGroup({
      transactionType: new FormControl('', [Validators.required]),
      type: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      currencyCode: new FormControl('', [Validators.required]),
      value: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      date: new FormControl('', [Validators.required])
    });
  }

  createTransaction() {
    const transaction: Transaction = {
      description: this.transaction.controls.description.value,
      value: this.transaction.controls.value.value,
      createdAt: new Date(this.transaction.controls.date.value),
      currency: this.transaction.controls.currencyCode.value,
      category: this.transaction.controls.category.value
    }
    if(this.transaction.controls.transactionType.value == "expenses") {
      transaction.value = -transaction.value;
      this.transactionService.addNewExpense(transaction, this.transaction.controls.type.value).then(async() => {
        const toast = await this.toastController.create({
          message: 'Sikeres hozzáadás',
          duration: 2000
        });
        toast.present();
        this.balanceService.updateCurrentBalance(transaction, this.transaction.controls.type.value).catch((error) => {
          console.log(error);
        });
        this.router.navigate(['detailed-balance']);
      }).catch(async (error) => {
        const toast = await this.toastController.create({
          message: 'Valami probléma lépett fel hozzáadáskor',
          duration: 2000
        });
        toast.present();
        console.log(error);
      });
    } else if (this.transaction.controls.transactionType.value == "incomes") {
      this.transactionService.addNewIncome(transaction, this.transaction.controls.type.value).then(async() => {
        const toast = await this.toastController.create({
          message: 'Sikeres hozzáadás',
          duration: 2000
        });
        toast.present();
        this.balanceService.updateCurrentBalance(transaction, this.transaction.controls.type.value).catch((error) => {
          console.log(error);
        });
        this.router.navigate(['detailed-balance']);
      }).catch(async (error) => {
        const toast = await this.toastController.create({
          message: 'Valami probléma lépett fel hozzáadáskor',
          duration: 2000
        });
        toast.present();
        console.log(error);
      });
    }
  }

  getExpCategories() {
    this.categoryService.getExpenseCategories().subscribe((res) => {
      this.categories = res.map((value) => {
        return {
          id: value.payload.doc.id,
          ...value.payload.doc.data()
        };
      })
    });
  }

  getIncCategories() {
    this.categoryService.getIncomeCategories().subscribe((res) => {
      this.categories = res.map((value) => {
        return {
          id: value.payload.doc.id,
          ...value.payload.doc.data()
        };
      })
    });
  }

  typeChanged(event: any) {
    this.option = event.detail.value;
    if(this.option == "incomes") {
      this.getIncCategories();
    } else if(this.option == "expenses") {
      this.getExpCategories();
    }
    console.log(this.option);
  }

  dateChange(event: any) {
    return formatDate(event, 'y. MMMM d.', 'hu-HU');
  }

  getSymbol(event: any) {
    this.symbol = getCurrencySymbol(event.detail.value.toUpperCase(), "wide");
  }
}
