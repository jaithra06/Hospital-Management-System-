import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-doctor-appointments',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './doctor-appointments.html',
  styleUrls: ['./doctor-appointments.css']
})
export class DoctorAppointments implements OnInit {

  appointments: any[] = [];
  token: string | null = localStorage.getItem("token");
  role: string | null = localStorage.getItem("role");

  loading = true;
  errorMessage = "";

  private apiUrl = "https://localhost:7256/api/v1.0/doctor/appointments";

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    
setTimeout(() => {
    this.loadDoctorAppointments();
  }, 200);
    if (!this.token || this.role !== "DOCTOR") {
      alert("Unauthorized Access");
      this.router.navigate(['/login']);
      return;
    }

    this.loadDoctorAppointments();
  }
  


  loadDoctorAppointments() {

    this.loading = true;
    this.errorMessage = "";

    const headers = new HttpHeaders({
      Authorization: "Bearer " + this.token
    });

    this.http.get<any[]>(this.apiUrl, { headers }).subscribe({
      next: (res) => {
        console.log("Doctor Appointments:", res);
        this.appointments = res;
        this.loading = false;
      },
      error: (err) => {
        console.error("Error:", err);
        this.errorMessage = "Failed to load appointments";
        this.loading = false;
      }
    });
  }

  completeAppointment(id: number) {

    const headers = new HttpHeaders({
      Authorization: "Bearer " + this.token
    });

    this.http.put(
      `https://localhost:7256/api/v1.0/doctor/appointments/${id}/complete`,
      {},
      { headers }
    ).subscribe({
      next: () => {
        alert("Appointment marked as completed");
        this.loadDoctorAppointments();
      },
      error: (err) => {
        console.error(err);
        alert("Failed to complete appointment");
      }
    });
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
