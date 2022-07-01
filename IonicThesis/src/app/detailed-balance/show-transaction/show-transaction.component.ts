import { formatDate, getCurrencySymbol, registerLocaleData } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Category } from 'src/app/models/category';
import { Transaction } from 'src/app/models/transaction';
import localHungarian from '@angular/common/locales/hu';
import { CategoryService } from 'src/app/services/category/category.service';
import { AlertController, ToastController } from '@ionic/angular';
import { TransactionService } from 'src/app/services/transaction/transaction.service';
import { BalanceService } from 'src/app/services/balance/balance.service';

@Component({
  selector: 'app-show-transaction',
  templateUrl: './show-transaction.component.html',
  styleUrls: ['./show-transaction.component.scss'],
})
export class ShowTransactionComponent implements OnInit {

  @Input('transactions') transactions: Transaction[];
  @Input('option') option: string;
  expenseCategories: Category[];
  incomesCategories: Category[];
  category: Category[];

  constructor(private categoryService: CategoryService, private toastController: ToastController, private alertController: AlertController,
     private transactionService: TransactionService, private balanceService: BalanceService) { 
    registerLocaleData(localHungarian);
    this.categoryService.getExpenseCategories().subscribe((res) => {
      this.expenseCategories = res.map((value) => {
        return {
          id: value.payload.doc.id,
          ...value.payload.doc.data()
        };
      });
    });
    this.categoryService.getIncomeCategories().subscribe((res) => {
      this.incomesCategories = res.map((value) => {
        return {
          id: value.payload.doc.id,
          ...value.payload.doc.data()
        };
      });
    });
  }

  ngOnInit() {}

  getSymbol(currencyCode: string) {
    return getCurrencySymbol(currencyCode.toUpperCase(), "wide");
  }

  getIconString(transaction: Transaction) {
    if(transaction.value <= 0 && this.expenseCategories) {
      return this.expenseCategories.find(x => x.id == transaction.category).icon;
    } else if (transaction.value > 0 && this.incomesCategories) {
      return this.incomesCategories.find(x => x.id == transaction.category).icon;
    }
  }

  getIconColor(transaction: Transaction) {
    if(transaction.value <= 0 && this.expenseCategories) {
      return this.expenseCategories.find(x => x.id == transaction.category).color;
    } else if (transaction.value > 0 && this.incomesCategories) {
      return this.incomesCategories.find(x => x.id == transaction.category).color;
    }
  }

  dateFormat(date: any) {
    return formatDate(date.toDate(), 'y. MMMM d.', 'hu-HU');
  }

  deleteTransaction(transaction: Transaction) {
    this.transactionService.deleteTransaction(transaction, this.option).then(async() => {
      await this.presentToast("Sikeresen eltávolítottad a tranzakciót.");
      transaction.value = transaction.value * -1;
      await this.balanceService.updateAfterDelete(transaction, this.option).catch((error) => {
        console.log(error);
      });
    }).catch(async(error) => {
      await this.presentToast("Valami hiba történt");
      console.log(error);
    });
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

  async presentAlertConfirm(transaction: Transaction) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Megerősítés',
      message: 'Biztosan törlöd a tranzakciót?',
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
            this.deleteTransaction(transaction);
          }
        }
      ]
    });
    await alert.present();
  }
}
