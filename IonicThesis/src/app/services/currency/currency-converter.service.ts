import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CurrencyConverterService {
  currency: any  = {
    date: "",
    huf: 0
  }

  constructor(private http: HttpClient) { }

  async convertCurrencyToHuf(from: string, value: number) {
    const url = "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/"+ from + "/huf.json";
    const test = await this.http.get(url).toPromise();
    this.currency = test;
    return Math.floor(this.currency.huf * value);
  }

}
