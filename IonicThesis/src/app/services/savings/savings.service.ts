import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Saving } from 'src/app/models/saving';
import { User } from 'src/app/models/user';
import { increment } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class SavingsService {
  user: User;

  constructor(private afStore: AngularFirestore) {
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  updateSaving(saving: Saving, amount: number) {
    const userRef: AngularFirestoreDocument<any> = this.afStore.doc(
      `users/${this.user.uid}`
    );
    if(saving.currentAmount + amount >= saving.targetAmount) {
      this.setReached(saving);
    }
    const update = userRef.collection('savings').doc(saving.id).update({
      currentAmount: increment(amount)
    });
    return update;
  }

  addNewSaving(saving: Saving) {
    const userRef: AngularFirestoreDocument<any> = this.afStore.doc(
      `users/${this.user.uid}`
    );
    return userRef.collection('savings').add(saving);
  }

  deleteSaving(saving: Saving) {
    const userRef: AngularFirestoreDocument<any> = this.afStore.doc(
      `users/${this.user.uid}`
    );
    return userRef.collection('savings').doc(saving.id).delete();
  }

  getSavings() {
    const userRef: AngularFirestoreDocument<any> = this.afStore.doc(
      `users/${this.user.uid}`
    );
    return userRef.collection('savings').snapshotChanges();
  }

  getSavingById(id: string) {
    const userRef: AngularFirestoreDocument<any> = this.afStore.doc(
      `users/${this.user.uid}`
    );
    return userRef.collection('savings').doc(id).get();
  }

  setReached(saving: Saving) {
    const userRef: AngularFirestoreDocument<any> = this.afStore.doc(
      `users/${this.user.uid}`
    );
    return userRef.collection('savings').doc(saving.id).update({
      isReached: true
    });
  }
}
