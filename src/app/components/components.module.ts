import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsRoutingModule } from './components-routing.module';
import { HeaderComponent } from './header/header.component';
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './home/home.component';
import { CarComponent } from './car/car.component';
import { SearchComponent } from './search/search.component';
import { BookingComponent } from './booking/booking.component';
import { MybookingComponent } from './mybooking/mybooking.component';
import { BookingfromComponent } from './bookingfrom/bookingfrom.component';
import { ProfileComponent } from './profile/profile.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { AllUsersComponent } from './all-users/all-users.component';
import { FooterComponent } from './footer/footer.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';
import { ServiceComponent } from './service/service.component';
import { AddcarComponent } from './addcar/addcar.component';

import { MenubarModule } from 'primeng/menubar';
import { SplitterModule } from 'primeng/splitter';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DataViewModule } from 'primeng/dataview';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { MenuModule } from 'primeng/menu';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { AvatarModule } from 'primeng/avatar';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { DialogService } from 'primeng/dynamicdialog';
import { TabViewModule } from 'primeng/tabview';
import { ProgressBarModule } from 'primeng/progressbar';
import { SidebarModule } from 'primeng/sidebar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DividerModule } from 'primeng/divider';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FileUploadModule } from 'primeng/fileupload';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipModule } from 'primeng/chip';
import { AccordionModule } from 'primeng/accordion';
import { SliderModule } from 'primeng/slider';
import { CarouselModule } from 'primeng/carousel';
import { ScrollTopModule } from 'primeng/scrolltop';
import { BrandsComponent } from './brands/brands.component';
import { ModelsComponent } from './models/models.component';
import { AllBookingComponent } from './all-booking/all-booking.component';
import { ChartModule } from 'primeng/chart';
import { PerformanceComponent } from './performance/performance.component';
import { RippleModule } from 'primeng/ripple';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ImageModule } from 'primeng/image';
import { InputSwitchModule } from 'primeng/inputswitch';
import { RecaptchaModule } from 'ng-recaptcha';
import { EnquiriesComponent } from './enquiries/enquiries.component';

@NgModule({
  declarations: [
    HeaderComponent,
    LayoutComponent,
    HomeComponent,
    CarComponent,
    SearchComponent,
    BookingComponent,
    MybookingComponent,
    BookingfromComponent,
    AddcarComponent,
    AllUsersComponent,
    ProfileComponent,
    AboutusComponent,
    FooterComponent,
    ContactUsComponent,
    PageNotFoundComponent,
    ServiceComponent,
    BrandsComponent,
    ModelsComponent,
    AllBookingComponent,
    PerformanceComponent,
    EnquiriesComponent,
  ],
  imports: [
    CommonModule,
    ComponentsRoutingModule,
    MenubarModule,
    SplitterModule,
    CardModule,
    SkeletonModule,
    ButtonModule,
    TagModule,
    DataViewModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    DropdownModule,
    FloatLabelModule,
    CalendarModule,
    DialogModule,
    ConfirmDialogModule,
    ToastModule,
    MenuModule,
    InputTextareaModule,
    NgxMaskDirective,
    AvatarModule,
    AvatarGroupModule,
    DynamicDialogModule,
    TabViewModule,
    ProgressBarModule,
    SidebarModule,
    ProgressSpinnerModule,
    DividerModule,
    SelectButtonModule,
    FileUploadModule,
    TableModule,
    CheckboxModule,
    ChipModule,
    AccordionModule,
    SliderModule,
    CarouselModule,
    ScrollTopModule,
    ChartModule,
    RippleModule,
    ConfirmPopupModule,
    OverlayPanelModule,
    ImageModule,
    InputSwitchModule,
    RecaptchaModule
  ],
  providers: [provideNgxMask(),ConfirmationService, MessageService,DialogService],
})
export class ComponentsModule {}
