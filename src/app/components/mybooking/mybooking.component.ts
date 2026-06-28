import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Constant } from 'src/app/constant/Constant';
import { ApiService } from 'src/app/Service/api-service.service';
import { APIResposnemodel } from 'src/app/Service/cars';
import { BookingfromComponent } from '../bookingfrom/bookingfrom.component';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-mybooking',
  templateUrl: './mybooking.component.html',
})
export class MybookingComponent {
  API = inject(ApiService);
  CustomerId: number = 0;
  isLoading: boolean = true;
  BookingList: any[] = [];
  ModelsData: any[] = [];
  CarBrands: any[] = [];
  BookingId: number = 0;
  carId: number = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialogService: DialogService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe((X: any) => {
      this.CustomerId = X.customerid;
    });
    this.GetAllBookingsByCustomerId(this.CustomerId);
    console.log('BookingId', this.BookingId);
    this.GetAllBrands();
    this.GetAllModels();
  }

  // GetAllBookingsByCustomerId(CustomerId: number) {
  //   this.API.getAllBookingsByCustomerId(CustomerId).subscribe(
  //     (res: APIResposnemodel) => {
  //       this.BookingList = res.data;
  //       this.isLoading = false;
  //     }
  //   );
  // }

  GetAllBookingsByCustomerId(CustomerId: number) {
    this.isLoading = true;
    this.API.getAllBookingsByCustomerId(CustomerId).subscribe(
      (res: APIResposnemodel) => {
        this.BookingList = res.data;
        this.BookingList.forEach((booking: any) => {
          if (booking.carId) {
            this.GetCarById(booking.carId, booking);
          }
        });

        this.isLoading = false;
      }
    );
  }

  GetCarById(carId: number, booking: any) {
    this.API.getCarById(carId).subscribe((res: APIResposnemodel) => {
      if (res.result && res.data) {
        booking.carImage = res.data.image;
        booking.modelId = res.data.modelId;
        booking.brandId = res.data.brandId;
        console.log('modelId', res.data.modelId);
        console.log('brandId', res.data.brandId);
      }
    });
  }

  getBrandName(brandId: number): string {
    // console.log('brandId', brandId);
    const brand = this.CarBrands.find((b) => b.brandId === brandId);
    return brand ? brand.brandName : '-';
  }

  getModelName(modelId: number): string {
    // console.log('modelId', modelId);
    const model = this.ModelsData.find((b) => b.modelId === modelId);
    return model ? model.name : '-';
  }

  GetAllModels() {
    this.API.getAllCarModels().subscribe((res: APIResposnemodel) => {
      this.ModelsData = res.data || [];
    });
  }

  GetAllBrands() {
    this.API.getAllBrands().subscribe((res: APIResposnemodel) => {
      this.CarBrands = res.data;
    });
  }

  Update(bookingId: number, carId: number) {
    this.BookingId = bookingId;
    this.carId = carId;

    this.API.getBookingById(bookingId).subscribe((res: APIResposnemodel) => {
      const ref = this.dialogService.open(BookingfromComponent, {
        data: {
          mode: 'update',
          carId: this.carId,
          booking: res.data,
        },
        header: 'Update Booking',
        styleClass: 'custom-center-dialog',
        closable: true,
        showHeader: true,
        modal: true,
        dismissableMask: true,
        width: '30vw',
      });

      ref.onClose.subscribe((result) => {
        if (result === 'updated') {
          this.GetAllBookingsByCustomerId(this.CustomerId);
        }
      });
    });
  }

  Delete(X: number) {
    this.confirmationService.confirm({
      message: 'Do you want to remove your booking?',
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',
      accept: () => {
        this.API.deleteBookingById(X).subscribe((res: APIResposnemodel) => {
          if (res.result) {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Booking Removed successfully',
            });
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: res.message,
            });
          }
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
        });
      },
    });
  }
}
