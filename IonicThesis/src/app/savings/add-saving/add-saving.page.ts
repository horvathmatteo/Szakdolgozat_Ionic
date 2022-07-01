import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Saving } from 'src/app/models/saving';
import { SavingsService } from 'src/app/services/savings/savings.service';

@Component({
  selector: 'app-add-saving',
  templateUrl: './add-saving.page.html',
  styleUrls: ['./add-saving.page.scss'],
})
export class AddSavingPage implements OnInit {
  savingForm: FormGroup;

  constructor(private savingsService: SavingsService, private toastController: ToastController, private router: Router) { }

  ngOnInit() {
    this.savingForm = new FormGroup({
      description: new FormControl('', [Validators.required]),
      targetValue: new FormControl('', [Validators.required])
    });
  }

  createNewSaving() {
    const saving: Saving = {
      name: this.savingForm.controls.description.value,
      currentAmount: 0,
      targetAmount: this.savingForm.controls.targetValue.value,
      isReached: false
    }
    this.savingsService.addNewSaving(saving).then(() => {
      this.presentToast("Sikeres hozzáadás.");
      this.router.navigate(['/savings']);
    }).catch((error) => {
      this.presentToast("Valami hiba történt");
      console.log(error);
    })
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

}
