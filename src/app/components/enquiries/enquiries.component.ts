import { Component } from '@angular/core';
import { ApiService } from 'src/app/Service/api-service.service';
import { APIResposnemodel } from 'src/app/Service/cars';

@Component({
  selector: 'app-enquiries',
  templateUrl: './enquiries.component.html',
})
export class EnquiriesComponent {
  enquiries: any[] = [];
  filteredEnquiries: any[] = [];
  enquirySearch: string = '';

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.GetEnquiries();
  }

  GetEnquiries() {
    this.api.getEnquiries().subscribe((res: APIResposnemodel) => {
      this.enquiries = res.data;
      this.filteredEnquiries = [...this.enquiries];
      console.log(res.data);
    });
  }

  filterEnquiries() {
    const search = this.enquirySearch.trim().toLowerCase();

    if (search) {
      this.filteredEnquiries = this.enquiries.filter(
        (enquiry) =>
          (enquiry.firstName &&
            enquiry.firstName.toLowerCase().includes(search)) ||
          (enquiry.lastName &&
            enquiry.lastName.toLowerCase().includes(search)) ||
          (enquiry.mobileNo && enquiry.mobileNo.toString().includes(search))
      );
    } else {
      this.filteredEnquiries = [...this.enquiries];
    }
  }
}
