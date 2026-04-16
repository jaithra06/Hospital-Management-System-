import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-doctor-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './doctor-register.html',
  styleUrls: ['./doctor-register.css']
})
export class DoctorRegister {

  name = '';
  email = '';
  password = '';
  specialization = '';

  successMessage = '';
  errorMessage = '';

  private baseUrl = 'https://localhost:7256/api/v1/auth';

  constructor(private http: HttpClient) {}

  registerDoctor() {
    const body = {
      name: this.name,
      email: this.email,
      password: this.password,
      specialization: this.specialization
    };

    this.http.post(`${this.baseUrl}/register/doctor`, body)
      .subscribe({
        next: () => {
          this.successMessage = 'Doctor registered successfully';
          this.errorMessage = '';
        },
        error: () => {
          this.errorMessage = 'Registration failed';
          this.successMessage = '';
        }
      });
  }
}
