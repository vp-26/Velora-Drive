import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { forkJoin } from 'rxjs';
import { ApiService } from 'src/app/Service/api-service.service';
import { APIResposnemodel, Car } from 'src/app/Service/cars';

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
})
export class CarComponent {
  API = inject(ApiService);
  isLoading: boolean = true;
  Location: any[] = [];
  CarBrands: any[] = [];
  carList: any[] = [];
  BrandData: any[] = [];
  ModelsData: any[] = [];
  filteredBrands: any[] = [];
  brandSearch: string = '';
  panelSizes = [15, 85];
  selectedBrand: number | null = null;

  constructor(
    private formbuilder: FormBuilder,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.AllCars();
    this.GetAllBrands();
    this.GetAllModels();
  }

  ngAfterViewInit() {
    this.panelSizes = [15, 85];
  }

  AllCars() {
    this.isLoading = true;
    this.API.getAllCars().subscribe((res: APIResposnemodel) => {
      this.carList = res.data.filter((car: any) => car.isActive === true);
      this.isLoading = false;
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

  GetModelByModelId(X: number) {
    this.API.getModelByModelId(X).subscribe((res: APIResposnemodel) => {
      this.ModelsData = res.data;
    });
  }

  View(carId: number) {
    this.router.navigate(['/layout/booking', carId]);
  }

  GetAllModels() {
    this.API.getAllCarModels().subscribe((res: APIResposnemodel) => {
      this.ModelsData = res.data || [];
    });
  }

  GetAllBrands() {
    this.API.getAllBrands().subscribe((res: APIResposnemodel) => {
      this.CarBrands = res.data;
      this.filteredBrands = [...this.CarBrands];
      console.log(res.data);
      console.log('carBrands', this.CarBrands);
    });
  }

  GetBrandByBrandId(X: number) {
    this.API.getBrandByBrandId(X).subscribe((res: APIResposnemodel) => {
      this.BrandData = res.data;
    });
  }

  filterBrands() {
    const search = this.brandSearch.trim().toLowerCase();
    if (search) {
      this.filteredBrands = this.CarBrands.filter((brand) =>
        brand.brandName.toLowerCase().includes(search)
      );
    } else {
      this.filteredBrands = [...this.CarBrands];
    }
  }

  selectBrand(brandId: number) {
    this.selectedBrand = brandId;

    if (brandId) {
      this.loadCarsByBrand(brandId);
    } else {
      this.AllCars();
    }
  }

  loadCarsByBrand(brandId: number) {
    this.isLoading = true;
    this.API.getCarsByBrandId(brandId).subscribe({
      next: (res: APIResposnemodel) => {
        this.carList = (
          res.data.filter((car: any) => car.isActive === true) || []
        ).map((car: Car) => {
          const model = this.ModelsData.find(
            (m) => m._id.toString() === car.modelId.toString()
          );
          return {
            ...car,
            modelName: model ? model.name : '-',
          };
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.carList = [];
        this.isLoading = false;
      },
    });
  }
}
