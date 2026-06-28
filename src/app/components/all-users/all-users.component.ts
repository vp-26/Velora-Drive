import { Component, inject } from '@angular/core';
import { ApiService } from 'src/app/Service/api-service.service';
import { APIResposnemodel } from 'src/app/Service/cars';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
})
export class AllUsersComponent {
  API = inject(ApiService);
  Users: any[] = [];
  isLoading = true;
  filteredUsers: any[] = [];
  userSearch: string = '';

  constructor() {}

  ngOnInit() {
    setTimeout(() => {
      this.GetAllUsers();
      this.isLoading = false;
    }, 100);
  }

  GetAllUsers() {
    this.API.getAllUsers().subscribe((res: APIResposnemodel) => {
      this.Users = res.data;
      this.filteredUsers = [...this.Users];
      console.log(res.data);
    });
  }

  filterUsers() {
    const search = this.userSearch.trim().toLowerCase();
    if (search) {
      this.filteredUsers = this.Users.filter(
        (user) =>
          (user.name && user.name.toLowerCase().includes(search)) ||
          (user.mobileNo && user.mobileNo.toString().includes(search))
      );
    } else {
      this.filteredUsers = [...this.Users];
    }
  }

  getSeverity(
    status: string
  ):
    | 'success'
    | 'secondary'
    | 'info'
    | 'warning'
    | 'danger'
    | 'contrast'
    | undefined {
    switch (status) {
      case 'CarOwner':
        return 'contrast';
      case 'Customer':
        return 'warning';
      default:
        return 'danger';
    }
  }
}
