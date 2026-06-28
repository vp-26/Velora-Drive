import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ApiService } from 'src/app/Service/api-service.service';
import { APIResposnemodel } from 'src/app/Service/cars';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  products: any[] = [];
  ModelsData: any[] = [];
  CarBrands: any[] = [];
  carList: any[] = [];
  responsiveOptions: any[] | undefined;

  API = inject(ApiService);

  CarsForm = this.formbuilder.group({
    location: ['', Validators.required],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
  });

  constructor(
    private formbuilder: FormBuilder,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.AllCars();
    this.GetAllModels();
    this.GetAllBrands();
  }

  AllCars() {
    this.API.getAllCars().subscribe((res: APIResposnemodel) => {
      this.carList = res.data.filter((car: any) => car.brandId === 5);
      console.log(this.carList);
    });
  }

  getBrandName(brandId: number): string {
    const brand = this.CarBrands.find((b) => b.brandId === brandId);
    return brand ? brand.brandName : '-';
  }

  getModelName(modelId: number): string {
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

  View(carId: number) {
    this.router.navigate(['/layout/booking', carId]);
  }

  Search() {
    const locationId = this.CarsForm.get('location')?.value;
    if (locationId) {
      this.router.navigate(['/layout/search', locationId]);
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please select a location',
      });
    }
  }

  book() {
    this.router.navigate(['layout/car']);
  }

  getSeverity(status: string): 'success' | 'warning' | 'danger' | 'info' {
    switch (status) {
      case 'INSTOCK':
        return 'success';
      case 'LOWSTOCK':
        return 'warning';
      case 'OUTOFSTOCK':
        return 'danger';
      default:
        return 'info';
    }
  }
}
