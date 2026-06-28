import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ApiService } from 'src/app/Service/api-service.service';
import { APIResposnemodel } from 'src/app/Service/cars';
import { forkJoin } from 'rxjs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-all-booking',
  templateUrl: './all-booking.component.html',
})
export class AllBookingComponent implements OnInit {
  @ViewChild('dt') table!: Table;

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.table.filterGlobal(input.value, 'contains');
  }
  API = inject(ApiService);
  CarBookingData: any[] = [];
  filteredCarBookingData: any[] = [];
  filterStartDate: string = '';
  filterEndDate: string = '';

  constructor(private messageService: MessageService) {}

  ngOnInit() {
    this.getAllBookings();
  }

  getBookingSeverity(
    status: string
  ): 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast' {
    switch (status) {
      case 'Pending':
        return 'warning';
      case 'Confirmed':
        return 'success';
      case 'Cancelled':
        return 'danger';
      default:
        return 'info';
    }
  }

  // getAllBookings() {
  //   this.API.getAllBookings().subscribe({
  //     next: (res: APIResposnemodel) => {
  //       this.CarBookingData = res.data || [];

  //       if (this.CarBookingData.length > 0) {
  //         const uniqueCustomerIds = [
  //           ...new Set(this.CarBookingData.map((b: any) => b.customerId)),
  //         ];

  //         const requests = uniqueCustomerIds.map((id) =>
  //           this.API.getUserByUserId(id)
  //         );

  //         forkJoin(requests).subscribe({
  //           next: (responses: APIResposnemodel[]) => {
  //             const userMap: any = {};
  //             responses.forEach((res: APIResposnemodel, index: number) => {
  //               userMap[uniqueCustomerIds[index]] = res.data;
  //             });

  //             this.CarBookingData = this.CarBookingData.map((booking: any) => {
  //               const user = userMap[booking.customerId];
  //               return {
  //                 ...booking,
  //                 name: user?.name || '-',
  //                 mobileNo: user?.mobileNo || '-',
  //               };
  //             });

  //             console.log('Final Bookings with Users:', this.CarBookingData);
  //           },
  //           error: (err) => {
  //             console.error('Error fetching users:', err);
  //           },
  //         });
  //       }
  //     },
  //     error: (err) => {
  //       console.error('API Error:', err);
  //     },
  //   });
  // }

  getAllBookings() {
    this.API.getAllBookings().subscribe({
      next: (res: APIResposnemodel) => {
        this.CarBookingData = res.data || [];
        this.filteredCarBookingData = [...this.CarBookingData];

        if (this.CarBookingData.length > 0) {
          const uniqueCustomerIds = [
            ...new Set(this.CarBookingData.map((b: any) => b.customerId)),
          ];
          const requests = uniqueCustomerIds.map((id) =>
            this.API.getUserByUserId(id)
          );

          forkJoin(requests).subscribe({
            next: (responses: APIResposnemodel[]) => {
              const userMap: any = {};
              responses.forEach(
                (res, index) => (userMap[uniqueCustomerIds[index]] = res.data)
              );

              this.CarBookingData = this.CarBookingData.map((booking: any) => {
                const user = userMap[booking.customerId];
                return {
                  ...booking,
                  name: user?.name || '-',
                  mobileNo: user?.mobileNo || '-',
                };
              });

              this.filteredCarBookingData = [...this.CarBookingData];
            },
            error: (err) => console.error('Error fetching users:', err),
          });
        }
      },
      error: (err) => console.error('API Error:', err),
    });
  }

  onDateFilterChange() {
    if (!this.filterStartDate && !this.filterEndDate) {
      this.filteredCarBookingData = [...this.CarBookingData];
      return;
    }

    const start = this.filterStartDate ? new Date(this.filterStartDate) : null;
    const end = this.filterEndDate ? new Date(this.filterEndDate) : null;

    this.filteredCarBookingData = this.CarBookingData.filter((booking) => {
      const bookingStart = new Date(booking.startDate);
      const bookingEnd = new Date(booking.endDate);

      if (start && end) return bookingStart >= start && bookingEnd <= end;
      if (start) return bookingStart >= start;
      if (end) return bookingEnd <= end;
      return true;
    });
  }

  // exportPDF() {
  //   const doc = new jsPDF();

  //   const columns = [
  //     { header: 'Booking ID', dataKey: 'bookingId' },
  //     { header: 'Full Name', dataKey: 'name' },
  //     { header: 'Mobile', dataKey: 'mobileNo' },
  //     { header: 'Car ID', dataKey: 'carId' },
  //     { header: 'Reason', dataKey: 'bookingReason' },
  //     { header: 'Destination', dataKey: 'destination' },
  //     { header: 'Start Date', dataKey: 'startDate' },
  //     { header: 'End Date', dataKey: 'endDate' },
  //     { header: 'Days', dataKey: 'totalDays' },
  //     { header: 'Amount', dataKey: 'price' },
  //     { header: 'Status', dataKey: 'status' },
  //   ];

  //   const rows = this.filteredCarBookingData.map((b) => ({
  //     bookingId: b.bookingId,
  //     name: b.name,
  //     mobileNo: b.mobileNo,
  //     carId: b.carId,
  //     bookingReason: b.bookingReason || '-',
  //     destination: b.destination,
  //     startDate: b.startDate,
  //     endDate: b.endDate,
  //     totalDays: b.totalDays,
  //     price: b.price,
  //     status: b.status,
  //   }));

  //   autoTable(doc, {
  //     columns,
  //     body: rows,
  //     startY: 20,
  //     theme: 'striped',
  //     headStyles: { fillColor: [41, 128, 185], textColor: 255 },
  //   });

  //   doc.text('Car Bookings Report', 14, 15);
  //   doc.save('CarBookings.pdf');
  // }

  formatDate = (date: any): string => {
    if (!date) return '-';
    const d = new Date(date);

    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = String(d.getFullYear()).slice(-2);

    return `${day}/${month}/${year}`;
  };

  exportPDF() {
    const doc = new jsPDF('p', 'mm', 'a4');

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Velora Drive Bookings Report', 105, 15, { align: 'center' });

    const today = new Date().toLocaleDateString();
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated on: ${today}`, 14, 22);

    const columns = [
      { header: 'Booking ID', dataKey: 'bookingId' },
      { header: 'Full Name', dataKey: 'name' },
      { header: 'Mobile', dataKey: 'mobileNo' },
      { header: 'Car ID', dataKey: 'carId' },
      { header: 'Reason', dataKey: 'bookingReason' },
      { header: 'Destination', dataKey: 'destination' },
      { header: 'Start Date', dataKey: 'startDate' },
      { header: 'End Date', dataKey: 'endDate' },
      { header: 'Days', dataKey: 'totalDays' },
      { header: 'Amount', dataKey: 'price' },
      { header: 'Status', dataKey: 'status' },
    ];

    // const rows = this.filteredCarBookingData.map((b) => ({
    //   bookingId: b.bookingId,
    //   name: b.name,
    //   mobileNo: b.mobileNo,
    //   carId: b.carId,
    //   bookingReason: b.bookingReason || '-',
    //   destination: b.destination,
    //   startDate: this.formatDate(b.startDate),
    //   endDate: this.formatDate(b.endDate),
    //   totalDays: b.totalDays,
    //   price: '₹ ' + b.price.toLocaleString('en-IN'),
    //   status: b.status,
    // }));

    const rows = this.filteredCarBookingData.map((b) => {
      let priceValue = b.price;
      if (typeof priceValue === 'string') {
        priceValue = priceValue.replace(/[^\d]/g, '');
      }

      const numericPrice = Number(priceValue);

      return {
        bookingId: b.bookingId,
        name: b.name,
        mobileNo: b.mobileNo,
        carId: b.carId,
        bookingReason: b.bookingReason || '-',
        destination: b.destination,
        startDate: this.formatDate(b.startDate),
        endDate: this.formatDate(b.endDate),
        totalDays: b.totalDays,
        price: isNaN(numericPrice) ? '0' : numericPrice.toLocaleString('en-IN'),
        status: b.status,
      };
    });

    autoTable(doc, {
      columns,
      body: rows,
      startY: 28,
      theme: 'striped',
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold',
        halign: 'center',
      },
      bodyStyles: {
        fontSize: 9,
        halign: 'center',
        valign: 'middle',
      },
      columnStyles: {
        price: { cellWidth: 20 },
        bookingReason: { cellWidth: 25 },
        destination: { cellWidth: 25 },
      },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      styles: {
        cellPadding: 3,
        lineWidth: 0.1,
        lineColor: [200, 200, 200],
      },
      didDrawPage: (data) => {
        const pageSize = doc.internal.pageSize;
        const pageHeight = pageSize.height || pageSize.getHeight();

        doc.setFontSize(9);
        doc.setTextColor(150);

        const pageInfo = doc.getCurrentPageInfo();
        doc.text(
          `Page ${pageInfo.pageNumber}`,
          data.settings.margin.left,
          pageHeight - 5
        );
      },
    });

    doc.save('CarBookings.pdf');
  }
}
