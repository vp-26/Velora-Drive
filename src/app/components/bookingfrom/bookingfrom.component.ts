import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { Constant } from 'src/app/constant/Constant';
import { ApiService } from 'src/app/Service/api-service.service';
import { APIResposnemodel } from 'src/app/Service/cars';

@Component({
  selector: 'app-bookingfrom',
  templateUrl: './bookingfrom.component.html',
})
export class BookingfromComponent implements OnInit {
  API = inject(ApiService);
  carId: number = 0;
  carData: any = {};
  price: number = 0;
  UserData: number = 0;
  UserEmail: string = '';
  minDate!: Date;
  mode: 'create' | 'update' = 'create';
  BookingData: any;
  CarsForm = this.formbuilder.group({
    bookingId: [0],
    carId: [0],
    customerId: [0],
    bookingReason: ['', Validators.required],
    destination: ['', Validators.required],
    startDate: [null as Date | null, Validators.required],
    endDate: [null as Date | null, Validators.required],
    termsAccepted: [false, Validators.requiredTrue],

    totalDays: [0],
    price: [0],
  });

  constructor(
    private formbuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private router: Router,
    public dialogService: DialogService,
    public dynamicDialogConfig: DynamicDialogConfig,
    public dynamicDialogRef: DynamicDialogRef
  ) {
    this.carId = Number(this.dynamicDialogConfig.data?.carId) || 0;
    this.BookingData = this.dynamicDialogConfig.data?.booking || null;
    this.mode = this.dynamicDialogConfig.data?.mode || 'create';

    const userInfo = localStorage.getItem(Constant.LOCAL_KEY);
    if (userInfo) {
      const parsed = JSON.parse(userInfo);
      this.UserData = parsed.userId;
      this.UserEmail = parsed.email;
    }

    this.CarsForm.patchValue({
      carId: this.carId,
      customerId: this.UserData,
    });

    if (this.mode === 'update' && this.BookingData) {
      this.patchFormValues();
    }
  }

  ngOnInit() {
    this.GetCar();

    this.CarsForm.get('startDate')?.valueChanges.subscribe(() =>
      this.calculateTotal()
    );
    this.CarsForm.get('endDate')?.valueChanges.subscribe(() =>
      this.calculateTotal()
    );

    const today = new Date();
    this.minDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
  }

  patchFormValues() {
    this.CarsForm.patchValue({
      bookingId: this.BookingData.bookingId,
      carId: this.BookingData.carId,
      customerId: this.BookingData.customerId,
      bookingReason: this.BookingData.bookingReason,
      destination: this.BookingData.destination,
      startDate: this.BookingData.startDate
        ? new Date(this.BookingData.startDate)
        : null,
      endDate: this.BookingData.endDate
        ? new Date(this.BookingData.endDate)
        : null,
      totalDays: this.BookingData.totalDays ?? 0,
      price: this.BookingData.price ?? 0,
    });

    this.calculateTotal();
  }

  get submitButtonLabel() {
    return this.mode === 'update' ? 'Update' : 'Book Now';
  }

  Book() {
    const formValue = this.CarsForm.value;
    const payload = {
      ...formValue,
      startDate: formValue.startDate
        ? this.formatDateToLocalString(new Date(formValue.startDate))
        : null,
      endDate: formValue.endDate
        ? this.formatDateToLocalString(new Date(formValue.endDate))
        : null,
    };

    if (this.mode === 'update') {
      this.API.updateBooking(payload).subscribe(
        (res: APIResposnemodel) => {
          if (res.result) {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Booking updated successfully',
            });
            this.dynamicDialogRef.close('updated');
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: res.message,
            });
          }
        },
        () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Update failed',
          });
        }
      );
    } else {
      const amount = this.price * (formValue.totalDays || 1);

      this.API.createOrder(amount).subscribe((order: any) => {
        this.openRazorpay(order, formValue);
      });
    }
  }

  openRazorpay(order: any, formValue: any) {
    const options: any = {
      key: 'rzp_test_RIcagvS05essHx',
      amount: order.amount,
      currency: order.currency,
      name: 'Car Rental Service',
      description: 'Booking Payment',
      order_id: order.id,
      handler: (response: any) => {
        this.API.verifyPayment({
          order_id: response.razorpay_order_id,
          payment_id: response.razorpay_payment_id,
          signature: response.razorpay_signature,
          email:  this.UserEmail
        }).subscribe((verifyRes: any) => {
          if (verifyRes.success) {
            const payload = {
              ...formValue,
              startDate: formValue.startDate
                ? this.formatDateToLocalString(new Date(formValue.startDate))
                : null,
              endDate: formValue.endDate
                ? this.formatDateToLocalString(new Date(formValue.endDate))
                : null,
            };

            this.API.createNewBooking(payload).subscribe(
              (res: APIResposnemodel) => {
                if (res.result) {
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Booking & Payment successful',
                  });
                  this.dynamicDialogRef.close(true);
                } else {
                  this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: res.message,
                  });
                }
              }
            );
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Payment Failed',
              detail: 'Signature mismatch',
            });
          }
        });
      },
      prefill: {
        name: 'Prince',
        email: 'admin@cars.com',
        contact: '9999999999',
      },
      modal: {
        escape: false,
        backdropclose: false,
        ondismiss: () => {
          console.log('Checkout closed, booking not created');
        },
      },
      theme: { color: '#3399cc' },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
    this.dynamicDialogRef.close(true);
  }

  GetCar() {
    this.API.getCarById(this.carId).subscribe((res: APIResposnemodel) => {
      this.carData = res.data;

      this.price =
        this.carData?.rentalPricing?.length > 0
          ? Number(this.carData.rentalPricing[0].rentalCost) || 0
          : 0;

      this.calculateTotal();
    });
  }

  formatDateToLocalString(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  calculateTotal() {
    const startVal = this.CarsForm.get('startDate')?.value;
    const endVal = this.CarsForm.get('endDate')?.value;

    const startDate = startVal ? new Date(startVal) : null;
    const endDate = endVal ? new Date(endVal) : null;

    if (startDate && endDate) {
      const utcStart = Date.UTC(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate()
      );
      const utcEnd = Date.UTC(
        endDate.getFullYear(),
        endDate.getMonth(),
        endDate.getDate()
      );

      if (utcEnd < utcStart) {
        this.CarsForm.patchValue(
          { totalDays: 0, price: 0 },
          { emitEvent: false }
        );
        return;
      }

      const diffDays =
        Math.floor((utcEnd - utcStart) / (1000 * 60 * 60 * 24)) + 1;
      const totalAmount = diffDays * this.price;

      this.CarsForm.patchValue(
        { totalDays: diffDays, price: totalAmount },
        { emitEvent: false }
      );

      console.log('Total Days:', diffDays);
      console.log('Per Day Price:', this.price);
      console.log('Total Amount (stored in price):', totalAmount);
    } else {
      this.CarsForm.patchValue(
        { totalDays: 0, price: 0 },
        { emitEvent: false }
      );
    }
  }
}
