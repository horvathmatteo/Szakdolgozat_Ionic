import { Injectable } from '@angular/core';
import { AlertController, Platform } from '@ionic/angular';
import { File } from '@awesome-cordova-plugins/file/ngx'
import localHungarian from '@angular/common/locales/hu';
import { formatDate, getCurrencySymbol, registerLocaleData } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class DataExportService {

  constructor(private platform: Platform, private file: File, private alertCtrl: AlertController) {
    registerLocaleData(localHungarian);
  }

  export2CSV(data: any, filename: string, start: string, end: string): boolean {
    if(!data || data.length === 0) {
      return false;
    }
    const result = this.convertToCSV(data, start, end);
    this.downloadCSV(result, filename);
  }

  convertToCSV(objArray, start, end) {
    const headerList = ["ID", "Leírás", "Összeg", "Valuta", "Dátum", "Kategória"];
    const objectKeys = ["id","description","value","currency","createdAt","category"];
    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let row = '';
    row += `${start}-${end}`;
    str += row + '\r\n';
    row = '';
    for (let index in headerList) {
     row += headerList[index] + ',';
    }
    row = row.slice(0, -1);
    str += row + '\r\n';
    for (let i = 0; i < array.length; i++) {
     let line = '';
     for (let index in headerList) {
      let head = objectKeys[index];
      if(head == "createdAt") {
        line +=  this.dateFormat(array[i][head]) + ',';
      } else if (head == "value") {
        line += (array[i][head]).toLocaleString('hu-HU', {minimumFractionDigits: 0, maximumFractionDigits: 2}) + ',';
      } else if (head == "currency") {
        line += this.getSymbol(array[i][head]) + ',';
      } else if (head == "category") {
        line += this.getSymbol(array[i][head]);
      } else { 
        line += array[i][head] + ',';
      }
     }
     str += line + '\r\n';
    }
    return str;
   }

  downloadCSV(csvdata: string, filename: string = 'export.csv'): void {
    if(!csvdata.match(/^data:text\/csv/i)) {
      csvdata = 'data:text/csv;charset=utf-8,' + csvdata;
    }

    if(this.platform.is('desktop')) {
      const data: string = encodeURI(csvdata);
      const link: HTMLElement = document.createElement('a');
      link.setAttribute('href', data);
      link.setAttribute('download', filename);
      link.click();
      return;
    }

    let path = null;
    if (this.platform.is('ios')) {
      path = this.file.documentsDirectory;
    } else if (this.platform.is('android')) {
      path = this.file.externalRootDirectory;
    }
    this.file.writeFile(path, filename, csvdata).then( async () => {
      const alertMsg = await this.alertCtrl.create(({
        header: 'Fáj mentése sikeres volt',
        subHeader: 'A fájl itt található: ' + path + filename,
        buttons: ['Ok']
      }));
      await alertMsg.present();
    }).catch(async (error) => {
      const alertMsg = await this.alertCtrl.create(({
        header: 'Valami hiba történt a mentéskor. Kérlek próbáld meg újra.',
        buttons: ['Ok']
      }));
      await alertMsg.present();
      console.log(error);
    });  
  }

  dateFormat(date: any) {
    return formatDate(date.toDate(), 'y. MMMM d.', 'hu-HU');
  }

  getSymbol(currencyCode: string) {
    return getCurrencySymbol(currencyCode.toUpperCase(), "wide");
  }

}
