import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/Service/api-service.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html'
})
export class ContactUsComponent {
  contactForm: FormGroup;
  message: string = '';

  constructor(private formBuilder: FormBuilder, private api: ApiService) {
    this.contactForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobileNo: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      message: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.contactForm.invalid) {
      this.message = '⚠️ Please fill all fields correctly!';
      return;
    }

    this.api.createEnquiry(this.contactForm.value).subscribe({
      next: (res) => {
        this.message = '✅ Enquiry submitted successfully!';
        this.contactForm.reset();
      },
      error: (err) => {
        this.message = err.error.message || '❌ Failed to submit enquiry!';
      }
    });
  }
}
