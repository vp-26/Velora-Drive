import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiService } from 'src/app/Service/api-service.service';
import { APIResposnemodel } from 'src/app/Service/cars';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-models',
  templateUrl: './models.component.html',
})
export class ModelsComponent {
  API = inject(ApiService);
  CarBrands: any[] = [];
  CarModels: any[] = [];
  filteredCarModels: any[] = [];
  CarTypes: any[] = [];
  visible: boolean = false;
  modelSearch: string = '';

  AddcarmodelsForm = this.formbuilder.group({
    brandId: [null, Validators.required],
    typeId: ['', Validators.required],
    modelName: ['', Validators.required],
  });

  constructor(
    private formbuilder: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadBrandsAndModels();
    this.GetAllCarTypes();
  }

  loadBrandsAndModels() {
    forkJoin({
      models: this.API.getAllCarModels(),
      brands: this.API.getAllBrands(),
      types: this.API.getAllCarTypes(),
    }).subscribe({
      next: ({ models, brands, types }) => {
        this.CarBrands = brands.data;
        this.CarTypes = types.data;

        const mergedData = models.data.map((model: any) => {
          const brand = brands.data.find(
            (b: any) => b.brandId === model.brandId
          );
          const type = types.data.find((t: any) => t.typeId === model.typeId);
          return {
            ...model,
            brandName: brand?.brandName || 'Unknown',
            modelName: model.name,
            typeName: type?.name || 'Unknown',
          };
        });

        this.CarModels = mergedData;
        this.filteredCarModels = [...this.CarModels];
      },
      error: (err) => {
        console.error('Error fetching data:', err);
      },
    });
  }

  Submit() {
    console.log(this.AddcarmodelsForm.value);
    this.API.addCarModel(this.AddcarmodelsForm.value).subscribe(
      (res: APIResposnemodel) => {
        if (res.result) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: res.message,
          });
          this.visible = false;
          this.AddcarmodelsForm.reset();
          this.loadBrandsAndModels();
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: res.message,
          });
        }
      }
    );
  }

  Delete(modelId: number) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this data?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-secondary p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',
      accept: () => {
        this.API.deleteCarModelById(modelId).subscribe(
          (res: APIResposnemodel) => {
            if (res.result) {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: res.message,
              });
              this.loadBrandsAndModels();
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: res.message,
              });
            }
          }
        );
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Cancelled',
          detail: 'Deletion cancelled by user',
        });
      },
    });
  }

  showDialog() {
    this.visible = true;
  }

  GetAllBrands() {
    this.API.getAllBrands().subscribe((res: APIResposnemodel) => {
      this.CarBrands = res.data;
      console.log(res.data);
      console.log('carBrands', this.CarBrands);
    });
  }

  GetAllCarTypes() {
    this.API.getAllCarTypes().subscribe((res: APIResposnemodel) => {
      this.CarTypes = res.data;
      console.log(res.data);
      console.log('CarTypes', this.CarTypes);
    });
  }

  GetAllCarModels() {
    this.API.getAllCarModels().subscribe((res: APIResposnemodel) => {
      this.CarModels = res.data;
      console.log(res.data);
      console.log('carBrands', this.CarBrands);
    });
  }

  filterModels() {
    const search = this.modelSearch.trim().toLowerCase();
    if (search) {
      this.filteredCarModels = this.CarModels.filter(
        (model) =>
          (model.modelName && model.modelName.toLowerCase().includes(search)) ||
          (model.brandName && model.brandName.toLowerCase().includes(search)) ||
          (model.typeName && model.typeName.toLowerCase().includes(search))
      );
    } else {
      this.filteredCarModels = [...this.CarModels];
    }
  }
}
