import { getCurrencySymbol } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { Saving } from 'src/app/models/saving';
import { CurrencyConverterService } from 'src/app/services/currency/currency-converter.service';
import { SavingsService } from 'src/app/services/savings/savings.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {
  @Input() saving: Saving;
  @Input() option: string;
  savingForm: FormGroup;
  currencies = ["huf", "eur", "usd", "jpy", "gbp", "chf", "aud", "cad", "cny", "bgn", 
        "czk", "dkk", "hrk", "mxn", "nok", "nzd", "pln", "ron", "rsd", "rub", "sek", "try", "uah", "zar"];
  symbol: any;
  constructor(private savingsService: SavingsService, private currencyService: CurrencyConverterService, private toastController: ToastController,
    private modalController: ModalController) { }

  ngOnInit() {
    this.savingForm = new FormGroup({
      amount: new FormControl('', [Validators.required]),
      currencyCode: new FormControl('', [Validators.required])
    });
  }

  async addAmount() {
    const amount = await this.currencyService.convertCurrencyToHuf(this.savingForm.controls.currencyCode.value, this.savingForm.controls.amount.value);
    if(this.option == "add") {
      this.savingsService.updateSaving(this.saving, amount).then(() => {
        this.presentToast("Sikeresen hozzáadtad a megtakarításhoz");
        this.modalController.dismiss();
      }).catch((error) => {
        this.presentToast("Valami hiba történt");
        console.log(error);
      });
    } else if(this.option == "remove") {
      this.savingsService.updateSaving(this.saving, -amount).then(() => {
        this.presentToast("Sikeresen elvettél a megtakarításodból");
        this.modalController.dismiss();
      }).catch((error) => {
        this.presentToast("Valami hiba történt");
        console.log(error);
      });
    }

  }

  getSymbol(event: any) {
    this.symbol = getCurrencySymbol(event.detail.value.toUpperCase(), "wide");
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

}
