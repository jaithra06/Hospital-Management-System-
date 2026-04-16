import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-patient-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './patient-register.html',
  styleUrls: ['./patient-register.css']
})
export class PatientRegister {

  name = '';
  email = '';
  password = '';
  age: number | null = null;
  gender = '';

  successMessage = '';
  errorMessage = '';

  private baseUrl = 'https://localhost:7256/api/v1/auth';

  constructor(private http: HttpClient) {}

  registerPatient() {
    const body = {
      name: this.name,
      email: this.email,
      password: this.password,
      age: this.age,
      gender: this.gender
    };

    this.http.post(`${this.baseUrl}/register/patient`, body)
      .subscribe({
        next: () => {
          this.successMessage = 'Patient registered successfully';
          this.errorMessage = '';
        },
        error: () => {
          this.errorMessage = 'Registration failed';
          this.successMessage = '';
        }
      });
  }
}
