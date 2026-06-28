import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/Service/api-service.service';
import { APIResposnemodel } from 'src/app/Service/cars';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
})
export class SearchComponent {
  currentLocationId: number = 0;
  SearchCar: any[] = [];
  Location: any[] = [];
  API = inject(ApiService);
  isLoading: boolean = true;

  constructor(private activatedRoute: ActivatedRoute, private router: Router) {
    this.activatedRoute.params.subscribe((X: any) => {
      this.currentLocationId = X.Id;
      this.GetAllCarsByLocation();
    });
  }

  ngOnInit() {
    console.log(this.currentLocationId);
  }

  GetAllCarsByLocation() {
    this.API.getAllCarsByLocation(this.currentLocationId).subscribe(
      (res: APIResposnemodel) => {
        this.SearchCar = res.data;
        this.isLoading = false;
      }
    );
  }

  View(carId: number) {
    this.router.navigate(['/layout/booking', carId]);
  }
}
