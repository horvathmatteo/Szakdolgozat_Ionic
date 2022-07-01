import { formatDate, getCurrencySymbol, registerLocaleData } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Transaction } from 'src/app/models/transaction';
import localHungarian from '@angular/common/locales/hu';
import { TransactionService } from 'src/app/services/transaction/transaction.service';

@Component({
  selector: 'app-category-transactions',
  templateUrl: './category-transactions.page.html',
  styleUrls: ['./category-transactions.page.scss'],
})
export class CategoryTransactionsPage implements OnInit {

  category: any;
  transactions: Transaction[] = [];

  constructor(private route: ActivatedRoute, private router: Router, private transactionService: TransactionService) {
    registerLocaleData(localHungarian);
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.category= this.router.getCurrentNavigation().extras.state.category;
        this.getCardTransactions();
        this.getCashTransactions();
      }
    });
    this.transactions = [];
   }

  ngOnInit() {

  }

  getCardTransactions() {
    this.transactionService.getCardExpensesCategory(this.category.id).subscribe((res) => {
      res.map((value) => {
        this.transactions.push({
          id: value.payload.doc.id,
          ...value.payload.doc.data()
        });
      });
    });
    this.transactionService.getCardIncomesCategory(this.category.id).subscribe((res) => {
      res.map((value) => {
        this.transactions.push({
          id: value.payload.doc.id,
          ...value.payload.doc.data()
        });
      });
    });
  }

  getCashTransactions() {
    this.transactionService.getCashExpensesCategory(this.category.id).subscribe((res) => {
      res.map((value) => {
        this.transactions.push({
          id: value.payload.doc.id,
          ...value.payload.doc.data()
        });
      });
    });
    this.transactionService.getCashIncomesCategory(this.category.id).subscribe((res) => {
      res.map((value) => {
        this.transactions.push({
          id: value.payload.doc.id,
          ...value.payload.doc.data()
        });
      });
    });
  }

  dateFormat(date: any) {
    return formatDate(date.toDate(), 'y. MMMM d.', 'hu-HU');
  }

  getSymbol(currencyCode: string) {
    return getCurrencySymbol(currencyCode.toUpperCase(), "wide");
  }
}
