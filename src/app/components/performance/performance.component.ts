import { Component, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ApiService } from 'src/app/Service/api-service.service';
import { APIResposnemodel } from 'src/app/Service/cars';
import { forkJoin, Observable } from 'rxjs';

@Component({
  selector: 'app-performance',
  templateUrl: './performance.component.html',
})
export class PerformanceComponent {
  API = inject(ApiService);
  Users: any[] = [];
  CarList: any[] = [];
  CarBrands: any[] = [];
  CarModels: any[] = [];
  CarBookingData: any[] = [];

  totalUsers = 1200;
  totalAmount = 523400;
  totalCarBrands: number = 0;
  totalCars: number = 0;
  totalBooking: number = 0;
  todayBookings: number = 0;
  yesterdayBookings: number = 0;
  todayProfit: number = 0;
  yesterdayProfit: number = 0;
  totalProfit: number = 0;
  totalBookings: number = 0;

  constructor(private messageService: MessageService) {}

  ngOnInit() {
    this.GetAllBookings();
    this.getAllUsers();
    this.AllCars();
    this.GetAllBrands();
  }

  getAllUsers() {
    this.API.getAllUsers().subscribe((res: APIResposnemodel) => {
      this.Users = res.data || [];
      this.totalUsers = this.Users.length;
    });
  }

  AllCars() {
    this.API.getAllCars().subscribe((res: APIResposnemodel) => {
      this.CarList = res.data;
      this.totalCars = this.CarList.length;
    });
  }

  GetAllBrands() {
    this.API.getAllBrands().subscribe((res: APIResposnemodel) => {
      this.CarBrands = res.data;
      this.totalCarBrands = this.CarBrands.length;
    });
  }

  GetAllBookings() {
    this.API.getAllBookings().subscribe({
      next: (res: APIResposnemodel) => {
        this.CarBookingData = res.data;

        this.totalBooking = this.CarBookingData.length;

        this.totalProfit = this.CarBookingData.reduce(
          (acc: number, booking: any) => acc + (booking.price || 0),
          0
        );

        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        const isSameDate = (d1: Date, d2: Date) =>
          d1.getDate() === d2.getDate() &&
          d1.getMonth() === d2.getMonth() &&
          d1.getFullYear() === d2.getFullYear();

        const todayBookings = this.CarBookingData.filter((booking: any) =>
          isSameDate(new Date(booking.createdAt), today)
        );
        this.todayBookings = todayBookings.length;
        this.todayProfit = todayBookings.reduce(
          (acc: number, booking: any) => acc + (booking.price || 0),
          0
        );

        const yesterdayBookings = this.CarBookingData.filter((booking: any) =>
          isSameDate(new Date(booking.createdAt), yesterday)
        );
        this.yesterdayBookings = yesterdayBookings.length;
        this.yesterdayProfit = yesterdayBookings.reduce(
          (acc: number, booking: any) => acc + (booking.price || 0),
          0
        );
      },
    });
  }
}
