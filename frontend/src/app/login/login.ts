import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {

  email = '';
  password = '';
  errorMessage = '';

  private loginUrl = 'https://localhost:7256/api/v1/auth/login';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login() {
    this.errorMessage = '';

    const body = {
      email: this.email,
      password: this.password
    };

    this.http.post<any>(this.loginUrl, body).subscribe({
      next: (data) => {
        // Store JWT & role
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        localStorage.setItem('userId', data.userId);

        // Redirect based on role (Angular routing)
        if (data.role === 'ADMIN') {
          this.router.navigate(['/admin-dashboard']);
        }
        else if (data.role === 'DOCTOR') {
          this.router.navigate(['/doctor-dashboard']);
        }
        else if (data.role === 'PATIENT') {
          this.router.navigate(['/patient-dashboard']);
        }
        else {
          this.errorMessage = 'Unknown role';
        }
      },

      error: () => {
        this.errorMessage = 'Invalid email or password';
      }
    });
  }
}
