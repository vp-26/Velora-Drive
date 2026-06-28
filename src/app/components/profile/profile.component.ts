import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Constant } from 'src/app/constant/Constant';
import { ApiService } from 'src/app/Service/api-service.service';
import { APIResposnemodel } from 'src/app/Service/cars';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  providers: [ConfirmationService, MessageService],
})
export class ProfileComponent implements OnInit {
  API = inject(ApiService);
  userData: any = {};
  userId: number = 0;
  visible: boolean = false;
  selectedImage: string = '';
  selectedImageName: string = '';

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    public dialogService: DialogService
  ) {
    const userInfo = localStorage.getItem(Constant.LOCAL_KEY);
    if (userInfo) {
      const parsed = JSON.parse(userInfo);
      this.userId = parsed.userId;
      console.log('UserId:', this.userId);
    }
  }

  ngOnInit(): void {
    if (this.userId) {
      this.getUserData(this.userId);
    }
  }

  openPreview(imageUrl: string, name: string) {
    this.selectedImage = imageUrl;
    this.selectedImageName = name;
    this.visible = true;
  }

  getUserData(userId: number) {
    this.API.getUserByUserId(userId).subscribe((res: APIResposnemodel) => {
      this.userData = res.data;
      console.log('User Data:', this.userData);
    });
  }

  viewImage(imageUrl: string) {
    console.log('imageUrl', imageUrl);
    this.selectedImage = imageUrl;
    this.visible = true;
  }

  Update() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to update your data ?',
      header: 'Update User',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',

      accept: () => {
        this.router.navigate(['/register', this.userId]);
      },
      reject: () => {
        this.router.navigate(['/layout']);
      },
    });
  }

  Delete(userId: number) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this profile permanently?',
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',

      accept: () => {
        this.API.deleteUserByUserId(userId).subscribe(
          (res: APIResposnemodel) => {
            if (res.result) {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Profile deleted Successfully',
              });
              localStorage.removeItem(Constant.LOCAL_KEY);
              localStorage.removeItem(Constant.LOGIN);
              this.router.navigate(['/login']);
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: res.message,
              });
            }
          },
          (err) => {
            console.error('Delete API Error:', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Something went wrong while deleting profile',
            });
          }
        );
      },
      reject: () => {
        this.router.navigate(['/layout/profile']);
      },
    });
  }
}
