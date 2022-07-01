import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { User } from 'firebase/auth';
import { Transaction } from 'src/app/models/transaction';
import { BalanceService } from '../balance/balance.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  user: User;
  userRef: AngularFirestoreDocument<any>;

  constructor(private afStore: AngularFirestore, private balanceService: BalanceService) {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.userRef = this.afStore.doc(
      `users/${this.user.uid}`
    );
  }

  public addNewExpense(transaction: Transaction, option: string) {
    return this.userRef.collection(option).doc(this.user.uid).collection('expenses').add(transaction);
  }

  public addNewIncome(transaction: Transaction, option: string) {
    return this.userRef.collection(option).doc(this.user.uid).collection('incomes').add(transaction);
  }

  getCardExpenses(start: Date, end: Date) {
    return this.userRef.collection('card').doc(this.user.uid).collection('expenses', ref => ref
    .where('createdAt', '>', start)
    .where('createdAt', '<', end)
    ).snapshotChanges();
  }

  getCashExpenses(start: Date, end: Date) {
    return this.userRef.collection('cash').doc(this.user.uid).collection('expenses', ref => ref
    .where('createdAt', '>', start)
    .where('createdAt', '<', end)
    ).snapshotChanges();
  }

  getCardIncomes(start: Date, end: Date) {
    return this.userRef.collection('card').doc(this.user.uid).collection('incomes', ref => ref
    .where('createdAt', '>', start)
    .where('createdAt', '<', end)
    ).snapshotChanges();
  }

  getCashIncomes(start: Date, end: Date) {
    return this.userRef.collection('cash').doc(this.user.uid).collection('incomes', ref => ref
    .where('createdAt', '>', start)
    .where('createdAt', '<', end)
    ).snapshotChanges();
  }

  deleteTransaction(transaction: Transaction, option: string) {
    if(transaction.value <= 0) {
      return this.userRef.collection(option).doc(this.user.uid).collection('expenses').doc(transaction.id).delete();
    } else if (transaction.value > 0) {
      return this.userRef.collection(option).doc(this.user.uid).collection('incomes').doc(transaction.id).delete();
    }
  }

  getCashIncomesCategory(category: string) {
    return this.userRef.collection('cash').doc(this.user.uid).collection('incomes', ref => ref
    .where('category', '==', category)
    ).snapshotChanges();
  }

  getCashExpensesCategory(category: string) {
    return this.userRef.collection('cash').doc(this.user.uid).collection('expenses', ref => ref
    .where('category', '==', category)
    ).snapshotChanges();
  }

  getCardIncomesCategory(category: string) {
    return this.userRef.collection('card').doc(this.user.uid).collection('incomes', ref => ref
    .where('category', '==', category)
    ).snapshotChanges();
  }

  getCardExpensesCategory(category: string) {
    return this.userRef.collection('card').doc(this.user.uid).collection('expenses', ref => ref
    .where('category', '==', category)
    ).snapshotChanges();
  }
}
