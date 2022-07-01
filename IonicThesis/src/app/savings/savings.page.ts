import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { Saving } from '../models/saving';
import { SavingsService } from '../services/savings/savings.service';
import { ModalPage } from './modal/modal.page';

@Component({
  selector: 'app-savings',
  templateUrl: './savings.page.html',
  styleUrls: ['./savings.page.scss'],
})
export class SavingsPage implements OnInit {
  savings: Saving[];

  constructor(private savingsService: SavingsService, private alertController: AlertController, private toastController: ToastController, private modalController: ModalController) {
    this.savingsService.getSavings().subscribe((res) => {
      this.savings = res.map((value) => {
        return {
          id: value.payload.doc.id,
          ...value.payload.doc.data()
        };
      });
    });
  }

  ngOnInit() {
  }

  calculatePercentage(saving: Saving) {
    return (saving.currentAmount / saving.targetAmount) * 100;
  }

  async presentDeleteConfirm(saving: Saving) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Biztos, hogy törlöd a megtakarítások közül?',
      buttons: [
        {
          text: 'Mégse',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button',
        }, {
          text: 'Igen',
          id: 'confirm-button',
          handler: () => {
            this.savingsService.deleteSaving(saving).then(() => {
              this.presentToast("Sikeresen törölted a megtakarítésok közül.")
            }).catch((error) => {
              this.presentToast("Valami hiba történt");
            });
          }
        }
      ]
    });
    await alert.present();
  }

  async presentAddModal(saving: Saving) {
    const modal = await this.modalController.create({
      component: ModalPage,
      backdropDismiss: true,
      id: 'savingModal',
      componentProps:{saving: saving, option: "add"}
      });
    return await modal.present();
  }

  async presentRemoveModal(saving: Saving) {
    const modal = await this.modalController.create({
      component: ModalPage,
      backdropDismiss: true,
      id: 'savingModal',
      componentProps:{saving: saving, option: "remove"}
      });
    return await modal.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }
}
