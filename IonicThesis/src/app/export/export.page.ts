import { formatDate, getCurrencySymbol, registerLocaleData } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Transaction } from '../models/transaction';
import { DataExportService } from '../services/export/data-export.service';
import { TransactionService } from '../services/transaction/transaction.service';
import localHungarian from '@angular/common/locales/hu';
import { Category } from '../models/category';
import { CategoryService } from '../services/category/category.service';

@Component({
  selector: 'app-export',
  templateUrl: './export.page.html',
  styleUrls: ['./export.page.scss'],
})
export class ExportPage implements OnInit {

  date = new Date();
  start: string;
  end: string;
  export: FormGroup;
  canExport = false;
  cardExpenses: Transaction[];
  cardIncomes: Transaction[];
  cashExpenses: Transaction[];
  cashIncomes: Transaction[];
  transactions: Transaction[] = [];
  expenseCategories: Category[];
  incomesCategories: Category[];

  constructor(private transactionService: TransactionService, private exportService: DataExportService, private categoryService: CategoryService) {
    registerLocaleData(localHungarian);
    this.categoryService.getExpenseCategories().subscribe((res) => {
      this.expenseCategories = res.map((value) => {
        return {
          id: value.payload.doc.id,
          ...value.payload.doc.data()
        };
      });
    });
    this.categoryService.getIncomeCategories().subscribe((res) => {
      this.incomesCategories = res.map((value) => {
        return {
          id: value.payload.doc.id,
          ...value.payload.doc.data()
        };
      });
    });
  }

  OnExport() {
    this.exportService.export2CSV(this.transactions, `${this.dateName(new Date())}_export.csv`, 
      formatDate(this.export.controls.start.value, 'y-MM-d.', 'hu-HU'), formatDate(this.export.controls.end.value, 'y-MM-d.', 'hu-HU'));
  }

  ngOnInit() {
    this.transactions = [];
    this.export = new FormGroup({
      type: new FormControl('', [Validators.required]),
      start: new FormControl('', [Validators.required]),
      end: new FormControl('', [Validators.required])
    });
  }

  getData() {
    this.transactions = [];
    if(this.export.controls.type.value == "card") {
      this.getCardTransactions(new Date(this.export.controls.start.value), new Date(this.export.controls.end.value));
    }else if (this.export.controls.type.value == "cash") {
      this.getCashTransactions(new Date(this.export.controls.start.value), new Date(this.export.controls.end.value));
    }
    this.canExport = true;
  }

  getCardTransactions(start: Date, end: Date) {
    this.transactionService.getCardExpenses(start, end).subscribe((res) => {
      res.map((value) => {
        this.transactions.push({
          id: value.payload.doc.id,
          ...value.payload.doc.data()
        });
      });
    });
    this.transactionService.getCardIncomes(start, end).subscribe((res) => {
      res.map((value) => {
        this.transactions.push({
          id: value.payload.doc.id,
          ...value.payload.doc.data()
        });
      });
    });
  }

  getCashTransactions(start: Date, end: Date) {
    this.transactionService.getCashExpenses(start, end).subscribe((res) => {
      this.cashExpenses = res.map((value) => {
        return {
          id: value.payload.doc.id,
          ...value.payload.doc.data()
        };
      });
      this.transactions.push(...this.cashExpenses);
    });
    this.transactionService.getCashIncomes(start, end).subscribe((res) => {
      this.cashIncomes = res.map((value) => {
        return {
          id: value.payload.doc.id,
          ...value.payload.doc.data()
        };
      });
      this.transactions.push(...this.cashIncomes);
    });
  }

  getIconString(transaction: Transaction) {
    if(transaction.value <= 0 && this.expenseCategories) {
      return this.expenseCategories.find(x => x.id == transaction.category).icon;
    } else if (transaction.value > 0 && this.incomesCategories) {
      return this.incomesCategories.find(x => x.id == transaction.category).icon;
    }
  }

  getIconColor(transaction: Transaction) {
    if(transaction.value <= 0 && this.expenseCategories) {
      return this.expenseCategories.find(x => x.id == transaction.category).color;
    } else if (transaction.value > 0 && this.incomesCategories) {
      return this.incomesCategories.find(x => x.id == transaction.category).color;
    }
  }

  dateChange(event: any) {
    return formatDate(event, 'y. MMMM d.', 'hu-HU');
  }

  dateFormat(date: any) {
    return formatDate(date.toDate(), 'y. MMMM d.', 'hu-HU');
  }

  dateName(date: any) {
    return formatDate(date, 'y-MM-dd', 'hu-HU');
  }

  getSymbol(currencyCode: string) {
    return getCurrencySymbol(currencyCode.toUpperCase(), "wide");
  }
}
