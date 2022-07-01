import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Category } from 'src/app/models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private afStore: AngularFirestore) { }

  createExpenseCategory(name: string, iconStr: string, colorStr: string) {
    return this.afStore.collection('expenseCategories').doc(name).set({
      icon: iconStr,
      color: colorStr
    });
  }

  createIncomeCategory(name: string, iconStr: string, colorStr: string) {
    return this.afStore.collection('incomeCategories').doc(name).set({
      icon: iconStr,
      color: colorStr
    });
  }

  getExpenseCategories() {
    const categoryRef: AngularFirestoreCollection<any> = this.afStore.collection(
      `expenseCategories`
    );
    return categoryRef.snapshotChanges();
  }

  getIncomeCategories() {
    const categoryRef: AngularFirestoreCollection<any> = this.afStore.collection(
      `incomeCategories`
    );
    return categoryRef.snapshotChanges();
  }
}
