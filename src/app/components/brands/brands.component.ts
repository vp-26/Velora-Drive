import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiService } from 'src/app/Service/api-service.service';
import { APIResposnemodel } from 'src/app/Service/cars';

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
})
export class BrandsComponent {
  API = inject(ApiService);
  CarBrands: any[] = [];
  filteredBrands: any[] = [];
  visible: boolean = false;
  brandSearch: string = '';

  AddbrandForm = this.formbuilder.group({
    brandId: [0, Validators.required],
    brandName: ['', Validators.required],
  });

  constructor(
    private formbuilder: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.GetAllBrands();
  }

  Submit() {
    console.log(this.AddbrandForm.value);
    this.API.addCarBrand(this.AddbrandForm.value).subscribe(
      (res: APIResposnemodel) => {
        if (res.result) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: res.message,
          });
          this.visible = false;
          // this.AddbrandForm.reset();
          this.GetAllBrands();
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

  Delete(brandId: number) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this data?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-secondary p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',
      accept: () => {
        this.API.deleteBrandById(brandId).subscribe((res: APIResposnemodel) => {
          if (res.result) {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: res.message,
            });
            this.GetAllBrands();
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
      this.filteredBrands = [...this.CarBrands];
      console.log(res.data);
      console.log('carBrands', this.CarBrands);
    });
  }

  filterBrands() {
    const search = this.brandSearch.trim().toLowerCase();
    if (search) {
      this.filteredBrands = this.CarBrands.filter(
        (brand) =>
          (brand.brandName && brand.brandName.toLowerCase().includes(search)) ||
          (brand.brandId && brand.brandId.toString().includes(search))
      );
    } else {
      this.filteredBrands = [...this.CarBrands];
    }
  }
}
