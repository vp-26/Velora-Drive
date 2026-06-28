import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './home/home.component';
import { CarComponent } from './car/car.component';
import { SearchComponent } from './search/search.component';
import { BookingComponent } from './booking/booking.component';
import { MybookingComponent } from './mybooking/mybooking.component';
import { AddcarComponent } from './addcar/addcar.component';
import { AllUsersComponent } from './all-users/all-users.component';
import { ProfileComponent } from './profile/profile.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { ServiceComponent } from './service/service.component';
import { BrandsComponent } from './brands/brands.component';
import { ModelsComponent } from './models/models.component';
import { AllBookingComponent } from './all-booking/all-booking.component';
import { PerformanceComponent } from './performance/performance.component';
import { EnquiriesComponent } from './enquiries/enquiries.component';


const routes: Routes = [
  {
    path: '',redirectTo: 'layout',pathMatch: 'full',
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '', redirectTo: 'home', pathMatch: 'full',
      },
      {
        path: 'car', component:CarComponent
      },
      {
        path: 'home', component:HomeComponent
      },
      { 
        path: 'search/:Id', component: SearchComponent 
      },
      { 
        path: 'booking/:carId', component: BookingComponent 
      },
      { 
        path: 'mybooking', component:MybookingComponent 
      },
      { 
        path: 'mybooking/:customerid', component:MybookingComponent 
      },
      { 
        path: 'addcar', component:AddcarComponent 
      },
      { 
        path: 'allbooking', component:AllBookingComponent 
      },
      { 
        path: 'allusers', component:AllUsersComponent 
      },
      { 
        path: 'profile', component:ProfileComponent 
      },
      { 
        path: 'aboutus', component:AboutusComponent 
      },
      { 
        path: 'contactus', component:ContactUsComponent 
      },
      { 
        path: 'service', component:ServiceComponent 
      },
      { 
        path: 'brands', component:BrandsComponent 
      },
      { 
        path: 'Models', component:ModelsComponent 
      },
      { 
        path: 'performance', component:PerformanceComponent 
      },
      { 
        path: 'Enquiries', component:EnquiriesComponent 
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComponentsRoutingModule {}
