import { formatDate, getCurrencySymbol, registerLocaleData } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Invoice } from 'src/app/models/invoice';
import { InvoiceService } from 'src/app/services/invoice/invoice.service';
import localHungarian from '@angular/common/locales/hu';
import { LocalNotifications } from '@awesome-cordova-plugins/local-notifications/ngx';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-invoice',
  templateUrl: './add-invoice.page.html',
  styleUrls: ['./add-invoice.page.scss'],
})
export class AddInvoicePage implements OnInit {
  currencies = ["huf", "eur", "usd", "jpy", "gbp", "chf", "aud", "cad", "cny", "bgn", 
        "czk", "dkk", "hrk", "mxn", "nok", "nzd", "pln", "ron", "rsd", "rub", "sek", "try", "uah", "zar"];
  selectedDate = new Date().toISOString();
  invoiceForm: FormGroup;
  symbol: any;

  constructor(private invoiceService: InvoiceService, private localNotification: LocalNotifications, private toastController: ToastController, private router: Router) { 
    registerLocaleData(localHungarian);
    this.selectedDate = formatDate(this.selectedDate, 'y. MMMM d.', 'hu-HU');
  }

  ngOnInit() {
    this.invoiceForm = new FormGroup({
      currencyCode: new FormControl('', [Validators.required]),
      value: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      date: new FormControl('', [Validators.required])
    });
  }

  getSymbol(event: any) {
    this.symbol = getCurrencySymbol(event.detail.value.toUpperCase(), "wide");
  }

  createInvoice() {
    const invoice: Invoice  = {
      currencyCode: this.invoiceForm.controls.currencyCode.value,
      name: this.invoiceForm.controls.description.value,
      value: this.invoiceForm.controls.value.value,
      deadline: new Date(this.invoiceForm.controls.date.value),
      isPaid: false
    };
    this.invoiceService.addNewInvoice(invoice).then(async () => {
      const pushDate: Date = invoice.deadline;
      pushDate.setDate(pushDate.getDate() - 1);
      pushDate.setHours(12, 0, 0);
      const textStr = "Számla neve: " + invoice.name + ", határidő: " + this.dateChange(invoice.deadline);
      this.localNotification.schedule({
        title: 'Számlád befizetési határideje hamarosan lejár',
        text: textStr,
        trigger: { at: pushDate}
      });
      const toast = await this.toastController.create({
        message: 'Sikeres hozzáadás',
        duration: 2000
      });
      toast.present();
      this.router.navigate(['invoices']);
    }).catch(async (error) => {
      const toast = await this.toastController.create({
        message: 'Valami probléma lépett fel hozzáadáskor',
        duration: 2000
      });
      toast.present();
      console.log(error);
    });
  }

  dateChange(event: any) {
    return formatDate(event, 'y. MMMM d.', 'hu-HU');
  }
}
