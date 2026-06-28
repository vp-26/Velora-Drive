import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Constant } from 'src/app/constant/Constant';
import { ApiService } from 'src/app/Service/api-service.service';
import { APIResposnemodel } from 'src/app/Service/cars';

@Component({
  selector: 'app-addcar',
  templateUrl: './addcar.component.html',
})
export class AddcarComponent {
  API = inject(ApiService);
  Location: any[] = [];
  CarList: any[] = [];
  carDialogVisible: boolean = false;
  selectedCar: any = null;
  uploadedFile: File | null = null;
  CarBrands: any[] = [];
  CarModels: any[] = [];
  ModelsData: any[] = [];
  searchTerm: string = '';
  selectedStatus: string = 'All';
  filteredCarList: any[] = [];
  visible: boolean = false;
  chooseLabel: string = 'Choose Image';
  isEditMode: boolean = false;
  mode: 'create' | 'update' = 'create';
  displayImage: boolean = false;
  selectedImage: string = '';

  transmissionTypes = [
    { label: 'Automatic', value: 'Automatic' },
    { label: 'Manual', value: 'Manual' },
  ];

  AddCarForm = this.formbuilder.group({
    carId: [0],
    modelId: ['', Validators.required],
    brandId: ['', Validators.required],
    image: ['', Validators.required],
    doors: ['', Validators.required],
    passengers: ['', Validators.required],
    transmission: ['', Validators.required],
    airCondition: [false],
    petrolVehicle: [false],
    sunroof: [false],
    insurance: [false],
    isActive: [true],
    rentalPricing: this.formbuilder.array([
      this.formbuilder.group({
        rentalPeriod: ['Day-basis'],
        rentalCost: [''],
      }),
    ]),
  });

  constructor(
    private formbuilder: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    public dialogService: DialogService,
    private router: Router
  ) {}

  ngOnInit() {
    this.GetAllBrands();
    this.AllCars();
    this.GetAllModels();
  }

  statusOptions = [
    { label: 'All', value: 'All' },
    { label: 'Active', value: 'Active' },
    { label: 'Inactive', value: 'Inactive' },
  ];

  get submitButtonLabel() {
    return this.mode === 'update' ? 'Update' : 'Add Car';
  }

  get rentalPricing(): FormArray {
    return this.AddCarForm.get('rentalPricing') as FormArray;
  }

  setRentalPricingFormArray(pricing: any[]) {
    const pricingFGs = pricing.map((item) =>
      this.formbuilder.group({
        rentalPeriod: [item.rentalPeriod, Validators.required],
        rentalCost: [item.rentalCost, [Validators.required, Validators.min(1)]],
      })
    );
    const formArray = this.formbuilder.array(pricingFGs) as FormArray;
    this.AddCarForm.setControl('rentalPricing', formArray);
  }

  AllCars() {
    this.API.getAllCars().subscribe((res: APIResposnemodel) => {
      this.CarList = res.data;
      this.filteredCarList = [...this.CarList];
    });
  }

  applyFilters() {
    let data = [...this.CarList];

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      data = data.filter(
        (car) =>
          car.carId?.toString().includes(term) ||
          this.getBrandName(car.brandId)?.toLowerCase().includes(term) ||
          this.getModelName(car.modelId)?.toLowerCase().includes(term)
      );
    }

    if (this.selectedStatus !== 'All') {
      const isActive = this.selectedStatus === 'Active';
      data = data.filter((car) => car.isActive === isActive);
    }

    this.filteredCarList = data;
  }

  ADDCAR() {
    console.log(this.AddCarForm.value);

    const formData = new FormData();

    Object.entries(this.AddCarForm.value).forEach(([key, value]) => {
      if (value === null || value === undefined) return;

      if (key === 'rentalPricing') {
        formData.append(key, JSON.stringify(value));
      } else if (key === 'image') {
        if (this.uploadedFile) {
          formData.append('image', this.uploadedFile);
        }
      } else if (typeof value === 'boolean' || typeof value === 'number') {
        formData.append(key, value.toString());
      } else if (typeof value === 'string') {
        formData.append(key, value);
      }
    });

    if (this.mode === 'update') {
      this.API.updateCar(formData).subscribe((res: APIResposnemodel) => {
        if (res.result) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: res.message,
          });
          this.GetAllBrands();
          this.AllCars();
          this.GetAllModels();
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: res.message,
          });
        }
      });
    } else {
      this.API.addNewCar(formData).subscribe((res: APIResposnemodel) => {
        if (res.result) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: res.message,
          });
          this.AllCars();
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: res.message,
          });
        }
        console.log('Add car API response:', res);
      });
    }
    this.visible = false;
  }

  GetCarById(carId: number) {
    this.API.getCarById(carId).subscribe((res: APIResposnemodel) => {
      const data = res.data;

      this.AddCarForm.patchValue({
        carId: data.carId,
        modelId: data.modelId,
        brandId: data.brandId,
        image: data.image,
        doors: data.doors,
        passengers: data.passengers,
        transmission: data.transmission,
        airCondition: data.airCondition,
        petrolVehicle: data.petrolVehicle,
        sunroof: data.sunroof,
        isActive: data.isActive,
      });

      if (data.rentalPricing?.length > 0) {
        this.setRentalPricingFormArray(data.rentalPricing);
      }

      this.mode = 'update';
      this.visible = true;
    });
  }

  showDialog() {
    this.visible = true;
  }

  showImage(img: string) {
    this.selectedImage = img;
    this.displayImage = true;
  }

  cancelImage(fileUpload: any) {
    fileUpload.clear();
    this.AddCarForm.get('image')?.reset();
  }

  FileUpload(event: any) {
    const file = event.files?.[0];
    if (file) {
      this.uploadedFile = file;
      this.AddCarForm.patchValue({
        image: file.name,
      });
      this.chooseLabel = 'Selected';
    }
  }

  Delete(carId: number) {
    this.API.deleteCarById(carId).subscribe((res: APIResposnemodel) => {
      if (res.result) {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: res.message,
        });
        this.visible = false;
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: res.message,
        });
      }
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

  Update(carId: number) {
    this.visible = true;
    this.mode = 'update';
    this.GetCarById(carId);
  }

  GetAllBrands() {
    this.API.getAllBrands().subscribe((res: APIResposnemodel) => {
      this.CarBrands = res.data;
      console.log(res.data);
      console.log('carBrands', this.CarBrands);
    });
  }

  onBrandChange(event: any) {
    const brandId = event.value;
    if (brandId) {
      this.GetModelsByBrandId(brandId);
    } else {
      this.CarModels = [];
    }
  }

  GetModelsByBrandId(X: number) {
    this.API.getModelsByBrandId(X).subscribe((res: APIResposnemodel) => {
      this.CarModels = res.data;
      console.log(res.data);
      console.log('CarModels', this.CarModels);
    });
  }

  goToDetails(carId: number) {
    this.router.navigate(['/layout/booking', carId]);
  }

  showCarDetails(car: any) {
    this.selectedCar = car;
    this.carDialogVisible = true;
  }

  // toggleStatus(car: any) {
  //   const newStatus = car.isActive;

  //   this.API.updateCarStatus(car.carId, newStatus).subscribe({
  //     next: (res: APIResposnemodel) => {
  //       if (res.result) {
  //         this.messageService.add({
  //           severity: 'success',
  //           summary: 'Success',
  //           detail: `Car status updated to ${
  //             newStatus ? 'Active' : 'Inactive'
  //           }`,
  //         });
  //       } else {
  //         this.messageService.add({
  //           severity: 'error',
  //           summary: 'Error',
  //           detail: res.message,
  //         });
  //         car.isActive = !newStatus;
  //       }
  //     },
  //     error: () => {
  //       this.messageService.add({
  //         severity: 'error',
  //         summary: 'Error',
  //         detail: 'Something went wrong!',
  //       });
  //       car.isActive = !newStatus;
  //     },
  //   });
  // }
}
