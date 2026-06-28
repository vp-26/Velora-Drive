import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class ServiceComponent {
  panelSizes = [25, 75];

  ngAfterViewInit() {
    this.panelSizes = [25, 75];
  }

  services = [
    {
      name: 'Car Rental With Driver',
      types: ['SUV', 'Sedan', 'MPV (Multi-Purpose Vehicle)'],
    },
    {
      name: 'Business Car Rental',
      types: ['Luxury Car', 'SUV', 'Sedan'],
    },
    {
      name: 'Wedding Car Rental',
      types: ['Luxury Car', 'Convertible', 'Coupe'],
    },
    {
      name: 'Airport Transfer',
      types: ['MPV (Multi-Purpose Vehicle)', 'Sedan', 'SUV'],
    },
    {
      name: 'Chauffeur Services',
      types: ['Luxury Car', 'SUV', 'Sedan'],
    },
  ];

  constructor(private router: Router) {}

  goToService(service: { name: string; types: string[] }) {
    console.log('User clicked:', service.name);
    console.log('Available car types:', service.types);

    this.router.navigate(['/layout/car'], {
      queryParams: { types: service.types },
    });
  }
}
