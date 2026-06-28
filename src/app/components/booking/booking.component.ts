import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { Constant } from 'src/app/constant/Constant';
import { ApiService } from 'src/app/Service/api-service.service';
import { APIResposnemodel } from 'src/app/Service/cars';
import { BookingfromComponent } from '../bookingfrom/bookingfrom.component';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
})
export class BookingComponent {
  API = inject(ApiService);
  sourceFrom: string | null = null;
  carId: number = 0;
  carData: any = {};
  carType: string = '';
  ModelsData: any[] = [];
  CarBrands: any[] = [];
  isEditMode: boolean = false;
  isLoading: boolean = true;
  items: MenuItem[] | undefined;
  visible: boolean = false;
  UserData: number = 0;
  panelSizes = [30, 70];

  constructor(
    private formbuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private router: Router,
    public dialogService: DialogService
  ) {
    const userInfo = localStorage.getItem(Constant.LOCAL_KEY);
    if (userInfo) {
      const parsed = JSON.parse(userInfo);
      this.UserData = parsed.userId;
    }

    this.activatedRoute.params.subscribe((X: any) => {
      this.carId = X.carId;
    });
  }

  ngOnInit() {
    this.GetCar();
    this.GetAllBrands();
    this.GetAllModels();
  }

  ngAfterViewInit() {
    this.panelSizes = [30, 70];
  }

  GetCar() {
    this.API.getCarById(this.carId).subscribe((res: APIResposnemodel) => {
      this.carData = res.data;
      console.log('carData', this.carData);
      this.isLoading = false;

      if (this.carData?.modelId) {
        this.GetCarsByModelId(this.carData.modelId);
      }
    });
  }

  GetCarsByModelId(modelId: number) {
    this.API.getCarsByModelId(modelId).subscribe((res: APIResposnemodel) => {
      if (res.data && res.data.length > 0) {
        const carType = res.data[0].type;
        console.log('Car Type:', carType);

        this.carType = carType;
      }
    });
  }

  getBrandName(brandId: number): string {
    
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
      console.log(res.data);
      console.log('carBrands', this.CarBrands);
    });
  }

  openModal() {
    this.dialogService.open(BookingfromComponent, {
      data: { carId: this.carId },
      header: 'Book Car',
      styleClass: 'custom-center-dialog',
      closable: true,
      showHeader: true,
      modal: true,
      dismissableMask: true,
      width: '30vw',
    });
  }
}
