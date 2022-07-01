import { formatDate, getCurrencySymbol, registerLocaleData } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BalanceService } from '../services/balance/balance.service';
import localHungarian from '@angular/common/locales/hu';
import { CurrentBalance } from '../models/current-balance';
import { Transaction } from '../models/transaction';
import { TransactionService } from '../services/transaction/transaction.service';
import { CategoryService } from '../services/category/category.service';
import { Category } from '../models/category';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  date = new Date();
  cashBalance: CurrentBalance = {};
  cardBalance: CurrentBalance = {};
  transactions: Transaction[] = [];
  categories: Category[] = [];
  currentBalance = 0;
  expenseBalance = 0;
  incomeBalance = 0;
  prevBalance = 0;
  prevExpenseBalance = 0;
  prevIncomeBalance = 0;

  constructor(private balanceService: BalanceService, private transactionService: TransactionService, private categoryService: CategoryService) { 
    registerLocaleData(localHungarian);
    this.categoryService.getExpenseCategories().subscribe((res) => {
      const expenseCategories = res.map((value) => {
        return {
          id: value.payload.doc.id,
          ...value.payload.doc.data()
        };
      });
      this.categories.push(...expenseCategories);
    });
    this.categoryService.getIncomeCategories().subscribe((res) => {
      const incomesCategories = res.map((value) => {
        return {
          id: value.payload.doc.id,
          ...value.payload.doc.data()
        };
      });
      this.categories.push(...incomesCategories);
    });
    this.getCardCurrentBalance();
    this.getCashCurrentBalance();
    this.getPrevCardBalance();
    this.getPrevCashBalance();
    this.getAllTransaction();
  }

  ngOnInit() {
  }

  getCurrentMonth() {
    return formatDate(this.date, 'y. MMMM', 'hu-HU');
  }

  getCashCurrentBalance() {
    this.balanceService.getCashBalance(this.date).subscribe((res) => {
      if(res.payload.data() == undefined) {
        // this.cashBalance.balanceHUF = 0;
        // this.cashBalance.expenseAmountHUF = 0;
        // this.cashBalance.incomeAmountHUF = 0;
        this.cashBalance = {
          balanceHUF: 0,
          expenseAmountHUF: 0,
          incomeAmountHUF: 0
        }
      } else {
        this.cashBalance = res.payload.data();
      }
      this.currentBalance += this.cashBalance.balanceHUF;
      this.expenseBalance += this.cashBalance.expenseAmountHUF;
      this.incomeBalance += this.cashBalance.incomeAmountHUF;
    });
  }

  getCardCurrentBalance() {
    this.balanceService.getCardBalance(this.date).subscribe((res) => {
      if(res.payload.data() == undefined) {
        // this.cardBalance.balanceHUF = 0;
        // this.cardBalance.expenseAmountHUF = 0;
        // this.cardBalance.incomeAmountHUF = 0;
        this.cardBalance = {
          balanceHUF: 0,
          expenseAmountHUF: 0,
          incomeAmountHUF: 0
        }
      } else {
        this.cardBalance = res.payload.data();
      }
      this.currentBalance += this.cardBalance.balanceHUF;
      this.expenseBalance += this.cardBalance.expenseAmountHUF;
      this.incomeBalance += this.cardBalance.incomeAmountHUF;
    });
  }

  getPrevCardBalance() {
    const prevDate = new Date(this.date.getFullYear(), this.date.getMonth() - 1);
    this.balanceService.getCardBalance(prevDate).subscribe((res) => {
      if(res.payload.data() == undefined) {
        // this.cardBalance.balanceHUF = 0;
        // this.cardBalance.expenseAmountHUF = 0;
        // this.cardBalance.incomeAmountHUF = 0;
        this.cardBalance = {
          balanceHUF: 0,
          expenseAmountHUF: 0,
          incomeAmountHUF: 0
        }
      } else {
        this.cardBalance = res.payload.data();
      }
      this.prevBalance += this.cardBalance.balanceHUF;
      this.prevExpenseBalance += this.cardBalance.expenseAmountHUF;
      this.prevIncomeBalance += this.cardBalance.incomeAmountHUF;
    });
  }

  getPrevCashBalance() {
    const prevDate = new Date(this.date.getFullYear(), this.date.getMonth() - 1);
    console.log(prevDate);
    this.balanceService.getCashBalance(prevDate).subscribe((res) => {
      if(res.payload.data() == undefined) {
        // this.cardBalance.balanceHUF = 0;
        // this.cardBalance.expenseAmountHUF = 0;
        // this.cardBalance.incomeAmountHUF = 0;
        this.cashBalance = {
          balanceHUF: 0,
          expenseAmountHUF: 0,
          incomeAmountHUF: 0
        }
      } else {
        this.cashBalance = res.payload.data();
      }
      this.prevBalance += this.cashBalance.balanceHUF;
      this.prevExpenseBalance += this.cashBalance.expenseAmountHUF;
      this.prevIncomeBalance += this.cashBalance.incomeAmountHUF;
    });
  }

  getAllTransaction() {
    this.date.setDate(1);
    const end = new Date();
    this.transactionService.getCardExpenses(this.date, end).subscribe((res) => {
      const cardExpenses = res.map((value) => {
        return {
          id: value.payload.doc.id,
          ...value.payload.doc.data()
        };
      });
      this.transactions.push(...cardExpenses);
    });
    this.transactionService.getCardIncomes(this.date, end).subscribe((res) => {
      const cardIncomes = res.map((value) => {
        return {
          id: value.payload.doc.id,
          ...value.payload.doc.data()
        };
      });
      this.transactions.push(...cardIncomes);
    });
    this.transactionService.getCashExpenses(this.date, end).subscribe((res) => {
      const cashExpenses = res.map((value) => {
        return {
          id: value.payload.doc.id,
          ...value.payload.doc.data()
        };
      });
      this.transactions.push(...cashExpenses);
    });
    this.transactionService.getCashIncomes(this.date, end).subscribe((res) => {
      const cashIncomes = res.map((value) => {
        return {
          id: value.payload.doc.id,
          ...value.payload.doc.data()
        };
      });
      this.transactions.push(...cashIncomes);
    });
  }

  calculatePercentage() {
    return -this.expenseBalance / (this.incomeBalance + -this.expenseBalance) * 100;
  }

  sortTransactions() {
    this.transactions.sort((a, b) => this.sortDateFormat(b.createdAt) - this.sortDateFormat(a.createdAt));
    return this.transactions;
  }

  getIconString(transaction: Transaction) {
    return this.categories.find(x => x.id == transaction.category).icon;
  }

  getIconColor(transaction: Transaction) {
    return this.categories.find(x => x.id == transaction.category).color;
  }

  getSymbol(currencyCode: string) {
    return getCurrencySymbol(currencyCode.toUpperCase(), "wide");
  }

  dateFormat(date: any) {
    return formatDate(date.toDate(), 'y. MMMM d.', 'hu-HU');
  }

  sortDateFormat(date: any) {
    return date.toDate().getDate();
  }
}
