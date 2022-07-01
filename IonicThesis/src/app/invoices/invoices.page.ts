import { formatDate, registerLocaleData } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Invoice } from '../models/invoice';
import { InvoiceService } from '../services/invoice/invoice.service';
import localHungarian from '@angular/common/locales/hu';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.page.html',
  styleUrls: ['./invoices.page.scss'],
})
export class InvoicesPage implements OnInit {
  currentInvoices: Invoice[];
  prevInvoices: Invoice[];
  currentAmount = 0;
  prevAmount = 0;
  date = new Date();

  constructor(private invoiceService: InvoiceService, private toastController: ToastController) {
    registerLocaleData(localHungarian);
    this.getInvoices();
  }

  ngOnInit() {
  }

  nextMonth() {
    this.date.setMonth(this.date.getMonth() + 1);
    this.currentAmount = 0;
    this.prevAmount = 0;
    this.getInvoices();
  }

  prevMonth() {
    this.date.setMonth(this.date.getMonth() - 1);
    this.currentAmount = 0;
    this.prevAmount = 0;
    this.getInvoices();
  }

  getInvoices() {
    this.date.setDate(1);
    const end = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);
    this.invoiceService.getInvoices(this.date, end).subscribe((res) => {
      this.currentInvoices = res.map((value) => {
        return {
          id: value.payload.doc.id,
          ...value.payload.doc.data()
        };
      });
      this.calculateCurrentAmount();
    });
    const prevEnd = new Date(this.date.getFullYear(), this.date.getMonth(), 0);
    const prevStart = new Date(prevEnd.getFullYear(), prevEnd.getMonth(), 1);
    this.invoiceService.getInvoices(prevStart, prevEnd).subscribe((res) => {
      this.prevInvoices = res.map((value) => {
        return {
          id: value.payload.doc.id,
          ...value.payload.doc.data()
        };
      });
      this.calculatePrevAmount();
    });
  } 

  calculateCurrentAmount() {
    this.currentAmount = 0;
    this.currentInvoices.forEach(invoice => {
      this.currentAmount += invoice.value;
    });
  }

  calculatePrevAmount() {
    this.prevAmount = 0;
    this.prevInvoices.forEach(invoice => {
      this.prevAmount += invoice.value;
    });
  }

  calculatePercentage(current: number) {
    const percent = (current / this.currentAmount) * 100;
    // if(Math.round(percent) > percent) {
    //   return Math.ceil((current / this.currentAmount) * 100);
    // }else if(Math.round(percent) < percent) {
    //   return Math.floor((current / this.currentAmount) * 100);
    // }
    return percent;
  }

  dateFormat(date: any) {
    return formatDate(date.toDate(), 'y. MMMM d.', 'hu-HU');
  }

  getCurrentMonth(date: Date) {
    return formatDate(date, 'y. MMMM', 'hu-HU');
  }

  isPaidChecked(invoice: Invoice) {
    if(!invoice.isPaid) {
     this.invoiceService.presentAlertConfirm(invoice);
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

  deleteInvoice(invoice: Invoice) {
    this.invoiceService.deleteInvoice(invoice).then(() => {
      this.presentToast("A számla sikeresen el lett távolítva");
    }).catch((error) => {
      this.presentToast("Valami hiba történt");
      console.log(error);
    })
  }
}
