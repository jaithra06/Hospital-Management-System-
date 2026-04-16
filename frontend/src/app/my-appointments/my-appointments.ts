import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-my-appointments',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-appointments.html',
  styleUrls: ['./my-appointments.css']
})
export class MyAppointments implements OnInit {

  appointments: any[] = [];
  loading = true;
  error = '';

  private apiUrl = 'https://localhost:7256/api/v1/appointments/my';
  token: string | null = localStorage.getItem("token");

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    if (!this.token) {
      alert("Token missing. Please login again.");
      this.router.navigate(['/login']);
      return;
    }

    this.loadAppointments();
  }

  loadAppointments() {
    this.http.get<any[]>(this.apiUrl, {
      headers: {
        Authorization: "Bearer " + this.token
      }
    }).subscribe({
      next: (res) => {
        console.log("Appointments Loaded:", res);
        this.appointments = res;
        this.loading = false;
      },
      error: (err) => {
        console.error("Error loading appointments:", err);
        this.error = "Failed to load appointments";
        this.loading = false;
      }
    });
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
