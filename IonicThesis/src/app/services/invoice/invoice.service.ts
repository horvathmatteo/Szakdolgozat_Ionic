import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { AlertController } from '@ionic/angular';
import { Invoice } from 'src/app/models/invoice';
import { User } from 'src/app/models/user';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  user: User;

  constructor(private afStore: AngularFirestore, private alertController: AlertController) {
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  addNewInvoice(invoice: Invoice) {
    const userRef: AngularFirestoreDocument<any> = this.afStore.doc(
      `users/${this.user.uid}`
    );
    return userRef.collection('invoices').add(invoice);
  }

  getInvoices(start: Date, end: Date) {
    const userRef: AngularFirestoreDocument<any> = this.afStore.doc(
      `users/${this.user.uid}`
    );
    return userRef.collection('invoices',  ref => ref
    .where('deadline', '>', start)
    .where('deadline', '<', end)
    ).snapshotChanges();
  }

  setPaid(invoice: Invoice) {
    const userRef: AngularFirestoreDocument<any> = this.afStore.doc(
      `users/${this.user.uid}`
    );
    return userRef.collection('invoices').doc(invoice.id).update({
      isPaid: true
    })
  }

  deleteInvoice(invoice: Invoice) {
    const userRef: AngularFirestoreDocument<any> = this.afStore.doc(
      `users/${this.user.uid}`
    );
    return userRef.collection('invoices').doc(invoice.id).delete();
  }

  async presentAlertConfirm(invoice: Invoice) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Figyelmeztetés',
      message: 'Biztos befizetettre állítod a számlát? Ezuk után nem fogunk figyelmezetetni a határidővel kapcsolatban.',
      buttons: [
        {
          text: 'Mégse',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button',
        }, {
          text: 'Rendben',
          id: 'confirm-button',
          handler: () => {
            this.setPaid(invoice);
          }
        }
      ]
    });
    await alert.present();
  }
}
