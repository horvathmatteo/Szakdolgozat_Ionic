import { formatDate, getCurrencySymbol, registerLocaleData } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Transaction } from '../models/transaction';
import { BalanceService } from '../services/balance/balance.service';
import localHungarian from '@angular/common/locales/hu';
import { TransactionService } from '../services/transaction/transaction.service';
import { Category } from '../models/category';
import { CategoryService } from '../services/category/category.service';
import { CurrencyConverterService } from '../services/currency/currency-converter.service';
import { CurrentBalance } from '../models/current-balance';

@Component({
  selector: 'app-detailed-balance',
  templateUrl: './detailed-balance.page.html',
  styleUrls: ['./detailed-balance.page.scss'],
})
export class DetailedBalancePage implements OnInit {
  type: string;
  loadExpenses = true;
  date = new Date();
  currentBalance: CurrentBalance = {};
  expenseAmount = 0;
  incomesAmount = 0;
  category: Category[];
  expenseCategories: Category[];
  incomesCategories: Category[];
  cardExpenses: Transaction[];
  cardIncomes: Transaction[];
  cashExpenses: Transaction[];
  cashIncomes: Transaction[];

  constructor(private transactionService: TransactionService, private categoryService: CategoryService, private currencyService: CurrencyConverterService,
    private balanceService: BalanceService) {
    registerLocaleData(localHungarian);
    this.getCashCurrentBalance();
    this.getAllTransaction();
  }

  ngOnInit() {
    this.currentBalance = {
      balanceHUF: 0,
      expenseAmountHUF: 0,
      incomeAmountHUF: 0
    };
    this.type = 'cash';
  }

  segmentChanged(ev: any) {
    this.refreshData();
  }

  refreshData() {
    if(this.type == "card") {
      this.getCardCurrentBalance();
    } else if(this.type == "cash") {
      this.getCashCurrentBalance();
    }
  }

  getAllTransaction() {
    this.date.setDate(1);
    const end = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);
    this.transactionService.getCardExpenses(this.date, end).subscribe((res) => {
      this.cardExpenses = res.map((value) => {
        return {
          id: value.payload.doc.id,
          ...value.payload.doc.data()
        };
      });
    });
    this.transactionService.getCardIncomes(this.date, end).subscribe((res) => {
      this.cardIncomes = res.map((value) => {
        return {
          id: value.payload.doc.id,
          ...value.payload.doc.data()
        };
      });
    });
    this.transactionService.getCashExpenses(this.date, end).subscribe((res) => {
      this.cashExpenses = res.map((value) => {
        return {
          id: value.payload.doc.id,
          ...value.payload.doc.data()
        };
      });
    });
    this.transactionService.getCashIncomes(this.date, end).subscribe((res) => {
      this.cashIncomes = res.map((value) => {
        return {
          id: value.payload.doc.id,
          ...value.payload.doc.data()
        };
      });
    });
  }

  concatCategory() {
    return this.expenseCategories.concat(...this.incomesCategories);
  }

  getIconString(transaction: Transaction) {
    this.category = this.concatCategory();
    return this.category.find(x => x.id == transaction.category).icon;
  }

  getIconColor(transaction: Transaction) {
    this.category = this.concatCategory();
    return this.category.find(x => x.id == transaction.category).color;
  }

  dateFormat(date: any) {
    return formatDate(date.toDate(), 'y. MMMM d.', 'hu-HU');
  }

  getSymbol(currencyCode: string) {
    return getCurrencySymbol(currencyCode.toUpperCase(), "wide");
  }

  prevMonth() {
    this.date.setMonth(this.date.getMonth() - 1);
    this.getAllTransaction();
    this.refreshData();
  }

  nextMonth() {
    this.date.setMonth(this.date.getMonth() + 1);
    this.getAllTransaction();
    this.refreshData();
  }

  getCurrentMonth(date: Date) {
    return formatDate(date, 'y. MMMM', 'hu-HU');
  }

  getCardCurrentBalance() {
    this.balanceService.getCardBalance(this.date).subscribe((res) => {
      if(res.payload.data() == undefined) {
        this.currentBalance.balanceHUF = 0;
        this.currentBalance.expenseAmountHUF = 0;
        this.currentBalance.incomeAmountHUF = 0;
      } else {
        this.currentBalance = res.payload.data();
      }
    });
  }

  getCashCurrentBalance() {
    this.balanceService.getCashBalance(this.date).subscribe((res) => {
      if(res.payload.data() == undefined) {
        this.currentBalance.balanceHUF = 0;
        this.currentBalance.expenseAmountHUF = 0;
        this.currentBalance.incomeAmountHUF = 0;
      } else {
        this.currentBalance = res.payload.data();
      }
    });
  }

  loadExpense() {
    this.loadExpenses = !this.loadExpenses;
  }
}
