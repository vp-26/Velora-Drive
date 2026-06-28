import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiService } from './api-service.service';
import { Observable } from 'rxjs';

export interface PaymentRequest {
  amount: number;
  name: string;
  upiId: string;
}

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private API = inject(ApiService);

  constructor(private http: HttpClient) {}

  generateUpiQr(amount: number, name: string, upiId: string): Observable<any> {
    const payload: PaymentRequest = { amount, name, upiId };
    console.log("payload",payload)
    return this.API.payment(payload);
  }
}
