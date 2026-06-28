import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { Constant } from '../constant/Constant';

@Injectable({
  providedIn: 'root',
})
export class CryptoService {
  constructor() {}

  EncryptData(data: any) {
    const stringData = typeof data === 'string' ? data : JSON.stringify(data);
    return CryptoJS.DES.encrypt(stringData,Constant.ENVIRONMENT_KEY).toString();
  }

  DecryptData(encryptedData: string): any {
    const bytes = CryptoJS.DES.decrypt(encryptedData, Constant.ENVIRONMENT_KEY);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    try {
      return JSON.parse(decryptedString);
    } catch {
      return decryptedString; 
    }
  }
}
