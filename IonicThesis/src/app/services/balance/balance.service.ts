import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { increment } from '@angular/fire/firestore';
import { Transaction } from 'src/app/models/transaction';
import { User } from 'src/app/models/user';
import { CurrencyConverterService } from '../currency/currency-converter.service';

@Injectable({
  providedIn: 'root'
})
export class BalanceService {
  user: User;
  userRef: AngularFirestoreDocument<any>;

  constructor(private afStore: AngularFirestore, private currenyConverter: CurrencyConverterService) {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.userRef = this.afStore.doc(
      `users/${this.user.uid}`
    );
  }

  async updateCurrentBalance(transaction: Transaction, option: string) {
    const docId = this.dateFormat(transaction.createdAt);
    this.userRef.collection(option).doc(this.user.uid).collection('currentBalance').doc(docId).update({
      [transaction.currency]: increment(transaction.value)
    }).catch(async error => {
      if (error.code == "not-found") {
        this.userRef.collection(option).doc(this.user.uid).collection('currentBalance').doc(docId).set({
          [transaction.currency]: transaction.value
        });
      } else {
        console.log(error);
      }
    });
    await this.updateTotal(transaction, option);
  }

  async updateTotal(transaction: Transaction, option: string) {
    const docId = this.dateFormat(transaction.createdAt);
    if(transaction.value > 0) {
      this.userRef.collection(option).doc(this.user.uid).collection('currentBalance').doc(docId).update({
        balanceHUF: increment(await this.currenyConverter.convertCurrencyToHuf(transaction.currency, transaction.value)),
        incomeAmountHUF: increment(await this.currenyConverter.convertCurrencyToHuf(transaction.currency, transaction.value))
      }).catch(async error => {
        if (error.code == "not-found") {
          this.userRef.collection(option).doc(this.user.uid).collection('currentBalance').doc(docId).set({
            balanceHUF: await this.currenyConverter.convertCurrencyToHuf(transaction.currency, transaction.value),
            incomeAmountHUF: increment(await this.currenyConverter.convertCurrencyToHuf(transaction.currency, transaction.value)),
            expenseAmountHUF: 0
          });
        } else {
          console.log(error);
        }
      });
    } else if(transaction.value <= 0) {
      this.userRef.collection(option).doc(this.user.uid).collection('currentBalance').doc(docId).update({
        balanceHUF: increment(await this.currenyConverter.convertCurrencyToHuf(transaction.currency, transaction.value)),
        expenseAmountHUF: increment(await this.currenyConverter.convertCurrencyToHuf(transaction.currency, transaction.value))
      }).catch(async error => {
        if (error.code == "not-found") {
          this.userRef.collection(option).doc(this.user.uid).collection('currentBalance').doc(docId).set({
            balanceHUF: await this.currenyConverter.convertCurrencyToHuf(transaction.currency, transaction.value),
            expenseAmountHUF: await this.currenyConverter.convertCurrencyToHuf(transaction.currency, transaction.value),
            incomeAmountHUF: 0
          });
        } else {
          console.log(error);
        }
      });
    }
  }

  async updateAfterDelete(transaction: Transaction, option: string) {
    const userRef: AngularFirestoreDocument<any> = this.afStore.doc(
      `users/${this.user.uid}`
    );
    const docId = this.dateFormat(transaction.createdAt);
    if(transaction.value > 0) {
      userRef.collection(option).doc(this.user.uid).collection('currentBalance').doc(docId).update({
        balanceHUF: increment(await this.currenyConverter.convertCurrencyToHuf(transaction.currency, transaction.value)),
        expenseAmountHUF: increment(await this.currenyConverter.convertCurrencyToHuf(transaction.currency, transaction.value))
      }).catch(async error => {
        if (error.code == "not-found") {
          userRef.collection(option).doc(this.user.uid).collection('currentBalance').doc(docId).set({
            balanceHUF: await this.currenyConverter.convertCurrencyToHuf(transaction.currency, transaction.value),
            expenseAmountHUF: increment(await this.currenyConverter.convertCurrencyToHuf(transaction.currency, transaction.value)),
            incomeAmountHUF: 0
          });
        } else {
          console.log(error);
        }
      });
    } else if(transaction.value <= 0) {
      userRef.collection(option).doc(this.user.uid).collection('currentBalance').doc(docId).update({
        balanceHUF: increment(await this.currenyConverter.convertCurrencyToHuf(transaction.currency, transaction.value)),
        incomeAmountHUF: increment(await this.currenyConverter.convertCurrencyToHuf(transaction.currency, transaction.value))
      }).catch(async error => {
        if (error.code == "not-found") {
          userRef.collection(option).doc(this.user.uid).collection('currentBalance').doc(docId).set({
            balanceHUF: await this.currenyConverter.convertCurrencyToHuf(transaction.currency, transaction.value),
            incomeAmountHUF: await this.currenyConverter.convertCurrencyToHuf(transaction.currency, transaction.value),
            expenseAmountHUF: 0
          });
        } else {
          console.log(error);
        }
      });
    }
    
  }

  getCardBalance(date: Date) {
    const userRef: AngularFirestoreDocument<any> = this.afStore.doc(
      `users/${this.user.uid}`
    );
    const docId = formatDate(date, 'yyyy-MM', 'en-US');
    return userRef.collection('card').doc(this.user.uid).collection('currentBalance').doc(docId).snapshotChanges();
  }

  getCashBalance(date: Date) {
    const userRef: AngularFirestoreDocument<any> = this.afStore.doc(
      `users/${this.user.uid}`
    );
    const docId = formatDate(date, 'yyyy-MM', 'en-US');
    return userRef.collection('cash').doc(this.user.uid).collection('currentBalance').doc(docId).snapshotChanges();
  }

  dateFormat(date: any) {
    return formatDate(date, 'yyyy-MM', 'en-US');
  }
}
