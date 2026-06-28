import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
})
export class LayoutComponent {
  isLoading = true;
  showScrollTop = false;

  ngOnInit() {
    setTimeout(() => {
      this.isLoading = false;
    }, 1500);
  }
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.showScrollTop = window.pageYOffset > 300;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
